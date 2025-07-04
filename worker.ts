import { Context, Hono } from "hono";
import { logger } from "hono/logger";
import { appendTrailingSlash } from "hono/trailing-slash";
import { serveStatic } from "hono/serve-static";
import type {
  Fetcher,
  ExportedHandler,
  Request as CFRequest,
  Response as CFResponse,
} from "@cloudflare/workers-types";

type WorkerEnv = {
  Bindings: {
    files: Fetcher;
  };
};
const app = new Hono<WorkerEnv>();

app.use(logger());
app.use(appendTrailingSlash());
app.use(
  serveStatic<WorkerEnv>({
    getContent: async (path, ctx: Context<WorkerEnv>) => {
      const res = await ctx.env.files.fetch(new URL(ctx.req.url));
      return res.bytes();
    },
  }),
);

// クラスをそのままexportできない
// https://github.com/cloudflare/workerd/issues/699
const worker: ExportedHandler<WorkerEnv> = {
  async fetch(req, env, ctx) {
    return (await app.fetch(
      new Request(req.url, req as CFRequest & Request),
      env,
      ctx,
    )) as CFResponse & Response;
  },
};
export default worker;
