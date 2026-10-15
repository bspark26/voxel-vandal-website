import { handleRequest } from "./handler";
import { D1RedirectStore } from "./store";

export interface Env {
  DB: D1Database;
}

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    return handleRequest(request, new D1RedirectStore(env.DB));
  },
} satisfies ExportedHandler<Env>;

