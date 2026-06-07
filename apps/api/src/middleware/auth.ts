import { createMiddleware } from "hono/factory";
import type { Env } from "../types/env";

type Role = "superadmin" | "dean" | "viewer";

interface AccessPayload {
  email: string;
  name?: string;
  roles?: Role[];
  universityId?: number;
}

export function auth(requiredRole?: Role) {
  return createMiddleware<{ Bindings: Env; Variables: { user: AccessPayload } }>(async (c, next) => {
    const jwt = c.req.header("CF-Access-JWT-Assertion");
    if (!jwt) {
      return c.json({ error: "Unauthorized — missing JWT" }, 401);
    }

    try {
      const teamDomain = c.env.CLOUDFLARE_ACCESS_TEAM_DOMAIN;
      const certsUrl = `https://${teamDomain}/cdn-cgi/access/certs`;
      const certsRes = await fetch(certsUrl, { cf: { cacheTtl: 3600 } } as unknown as RequestInit);
      if (!certsRes.ok) throw new Error("Failed to fetch JWKS");
      const certs = (await certsRes.json()) as { keys: JsonWebKey[] };

      const header = JSON.parse(atob(jwt.split(".")[0])) as { kid: string };
      const key = certs.keys.find((k) => (k as JsonWebKey & { kid?: string }).kid === header.kid);
      if (!key) throw new Error("Signing key not found");

      const cryptoKey = await crypto.subtle.importKey(
        "jwk",
        key,
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["verify"]
      );

      const verified = await crypto.subtle.verify(
        "RSASSA-PKCS1-v1_5",
        cryptoKey,
        Uint8Array.from(atob(jwt.split(".")[2].replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0)),
        new TextEncoder().encode(`${jwt.split(".")[0]}.${jwt.split(".")[1]}`)
      );

      if (!verified) throw new Error("JWT verification failed");

      const payload = JSON.parse(atob(jwt.split(".")[1])) as AccessPayload & { email: string };
      interface CustomClaims {
        "https://tawjih.ai/roles"?: Role[];
        "https://tawjih.ai/university_id"?: number;
      }
      const claims = payload as AccessPayload & CustomClaims;
      const user: AccessPayload = {
        email: claims.email,
        name: claims.name,
        roles: claims["https://tawjih.ai/roles"] || ["viewer"],
        universityId: claims["https://tawjih.ai/university_id"],
      };

      if (requiredRole && !user.roles?.includes(requiredRole) && !user.roles?.includes("superadmin")) {
        return c.json({ error: "Forbidden — insufficient role" }, 403);
      }

      c.set("user", user);
      await next();
      return;
    } catch (err) {
      return c.json({ error: "Unauthorized — invalid JWT", detail: String(err) }, 401);
    }
  });
}
