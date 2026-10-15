import { handleApi } from "./router";
import { authenticateAdmin } from "./security";
import type { Env } from "./types";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const admin = await authenticateAdmin(request, env);
    if (!admin) {
      return new Response("Voxel Vandal Admin is protected.", {
        status: 403,
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": "text/plain; charset=utf-8",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }

    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      return handleApi(request, env, admin);
    }
    return env.STATIC_ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
