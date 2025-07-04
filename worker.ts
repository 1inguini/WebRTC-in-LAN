import { Context, Hono } from "hono";
import { logger } from "hono/logger";
import { appendTrailingSlash } from "hono/trailing-slash";
import { serveStatic } from "hono/serve-static";
import type { Fetcher } from "@cloudflare/workers-types";

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
    async getContent(path, ctx: Context<WorkerEnv>) {
      const res = await ctx.env.files.fetch(new URL(ctx.req.url)); // pathだと頭に"/"がついてなくてコケる
      return res.bytes();
    },
  }),
);

export default app;
