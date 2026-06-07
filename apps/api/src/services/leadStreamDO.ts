import { DurableObject } from "cloudflare:workers";

interface Connection {
  ws: WebSocket;
  universityId?: number;
}

export class LeadStreamDO extends DurableObject {
  connections: Set<Connection> = new Set();

  constructor(ctx: DurableObjectState, env: never) {
    super(ctx, env as Record<string, unknown>);
  }

  async fetch(request: Request): Promise<Response> {
    const upgradeHeader = request.headers.get("Upgrade");
    if (upgradeHeader !== "websocket") {
      return new Response("Expected websocket", { status: 400 });
    }

    const [client, server] = Object.values(new WebSocketPair()) as [WebSocket, WebSocket];
    const url = new URL(request.url);
    const universityId = url.searchParams.get("universityId")
      ? parseInt(url.searchParams.get("universityId")!, 10)
      : undefined;

    const conn: Connection = { ws: server, universityId };
    this.connections.add(conn);

    server.accept();
    server.addEventListener("close", () => {
      this.connections.delete(conn);
    });

    return new Response(null, { status: 101, webSocket: client });
  }

  broadcast(message: object, universityId?: number) {
    const payload = JSON.stringify(message);
    for (const conn of this.connections) {
      if (universityId && conn.universityId !== universityId) continue;
      try {
        conn.ws.send(payload);
      } catch {
        this.connections.delete(conn);
      }
    }
  }
}
