import { Hono } from "hono";
import type { Env } from "../../types/env";

const auth = new Hono<{ Bindings: Env }>();

// ─── JWT helpers (HMAC-SHA256, Web Crypto API) ─────────────────────────────

function b64url(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  return btoa(String.fromCharCode(...bytes))
    .replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function signJWT(payload: Record<string, unknown>, secret: string, expirySeconds = 28800): Promise<string> {
  const header = b64url(new TextEncoder().encode(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const body = b64url(new TextEncoder().encode(JSON.stringify({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expirySeconds,
  })));
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${header}.${body}`));
  return `${header}.${body}.${b64url(sig)}`;
}

export async function verifyAdminJWT(token: string, secret: string): Promise<Record<string, unknown> | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, body, sig] = parts;
  try {
    const key = await crypto.subtle.importKey(
      "raw", new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" }, false, ["verify"]
    );
    const sigBytes = Uint8Array.from(
      atob(sig.replace(/-/g, "+").replace(/_/g, "/")),
      (c) => c.charCodeAt(0)
    );
    const valid = await crypto.subtle.verify(
      "HMAC", key, sigBytes, new TextEncoder().encode(`${header}.${body}`)
    );
    if (!valid) return null;
    const payload = JSON.parse(
      new TextDecoder().decode(
        Uint8Array.from(atob(body.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0))
      )
    ) as Record<string, unknown>;
    if (typeof payload.exp === "number" && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

// ─── PBKDF2 password verification ─────────────────────────────────────────

async function deriveKey(password: string, salt: string): Promise<string> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: new TextEncoder().encode(salt), iterations: 100000, hash: "SHA-256" },
    keyMaterial, 256
  );
  return b64url(bits);
}

// ─── Constant-time string comparison ──────────────────────────────────────

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Still iterate to prevent timing leak on length
    let diff = 0;
    for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) ?? 0) ^ (b.charCodeAt(i) ?? 0);
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// ─── Rate limit: 5 attempts per 15 min per IP ─────────────────────────────

async function loginRateLimit(cache: KVNamespace, ip: string): Promise<boolean> {
  const key = `ratelimit:admin:login:${ip}`;
  const current = await cache.get(key);
  const count = current ? parseInt(current, 10) : 0;
  if (count >= 5) return false;
  await cache.put(key, String(count + 1), { expirationTtl: 900 }); // 15 min window
  return true;
}

// ─── POST /api/admin/auth/login ────────────────────────────────────────────

auth.post("/login", async (c) => {
  const ip = c.req.header("CF-Connecting-IP") || "127.0.0.1";

  // Rate limit before any processing
  const allowed = await loginRateLimit(c.env.CACHE, ip);
  if (!allowed) {
    return c.json({ error: "Trop de tentatives. Réessayez dans 15 minutes." }, 429);
  }

  // Validate request body — accept both {password} and {email, password}
  let body: { email?: string; password?: string } = {};
  try {
    body = await c.req.json() as { email?: string; password?: string };
  } catch {
    return c.json({ error: "Corps de requête invalide." }, 400);
  }
  if (typeof body.password !== "string" || body.password.length < 1) {
    return c.json({ error: "Mot de passe requis." }, 400);
  }

  // Verify env vars are configured
  if (!c.env.JWT_SECRET || !c.env.ADMIN_PASSWORD_HASH || !c.env.ADMIN_PASSWORD_SALT) {
    return c.json({ error: "Admin auth non configuré." }, 503);
  }

  // If email provided, validate it against allowed admin email
  if (body.email !== undefined) {
    const adminEmail = c.env.ADMIN_EMAIL ?? "admin@jad2advisory.com";
    if (!constantTimeEqual(body.email.toLowerCase().trim(), adminEmail.toLowerCase())) {
      return c.json({ error: "Identifiants incorrects." }, 401);
    }
  }

  // Derive key from submitted password and compare
  const derived = await deriveKey(body.password, c.env.ADMIN_PASSWORD_SALT);
  if (!constantTimeEqual(derived, c.env.ADMIN_PASSWORD_HASH)) {
    return c.json({ error: "Identifiants incorrects." }, 401);
  }

  // Clear rate limit counter on successful login
  await c.env.CACHE.delete(`ratelimit:admin:login:${ip}`);

  // Issue 8-hour JWT with email embedded
  const adminEmail = c.env.ADMIN_EMAIL ?? "admin@jad2advisory.com";
  const token = await signJWT({ role: "admin", sub: "admin", email: adminEmail }, c.env.JWT_SECRET, 28800);
  return c.json({ token, expiresIn: 28800 });
});

// ─── POST /api/admin/auth/verify ──────────────────────────────────────────

auth.post("/verify", async (c) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ valid: false }, 401);
  }
  const token = authHeader.slice(7);
  if (!c.env.JWT_SECRET) return c.json({ valid: false }, 503);
  const payload = await verifyAdminJWT(token, c.env.JWT_SECRET);
  if (!payload || payload.role !== "admin") return c.json({ valid: false }, 401);
  return c.json({ valid: true, expiresAt: payload.exp });
});

export default auth;
