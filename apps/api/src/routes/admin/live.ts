import { Hono } from "hono";
import { auth } from "../../middleware/auth";
import type { Env } from "../../types/env";

const app = new Hono<{ Bindings: Env; Variables: { user: { email: string; universityId?: number } } }>();

app.get("/", auth("dean"), async (c) => {
  const user = c.get("user");
  const universityId = user.universityId;
  if (!universityId) return c.json({ error: "No university assigned" }, 403);

  const id = c.env.LEAD_STREAM.idFromName(`leads:${universityId}`);
  const stub = c.env.LEAD_STREAM.get(id);

  const url = new URL(c.req.url);
  url.searchParams.set("universityId", String(universityId));

  const res = await stub.fetch(url.toString(), {
    headers: {
      Upgrade: "websocket",
    },
  });

  if (res.status === 101) {
    return res;
  }

  // Fallback to SSE if WebSocket not available
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      const send = (data: object) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          // stream closed
        }
      };

      send({ type: "connected", universityId, timestamp: new Date().toISOString() });

      // Keep alive
      const interval = setInterval(() => {
        send({ type: "ping", timestamp: new Date().toISOString() });
      }, 30000);

      // Cleanup on abort
      c.req.raw.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
});

export default app;
