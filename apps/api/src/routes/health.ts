import { Hono } from "hono";
import type { Env } from "../types/env";

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) => {
  return c.json({
    status: "ok",
    service: "tawjih-api",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    environment: c.env.ENVIRONMENT,
  });
});

export default app;
