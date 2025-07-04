import { Hono } from "hono";
import { logger } from "hono/logger";
import { appendTrailingSlash } from "hono/trailing-slash";
import { serveStatic } from "hono/serve-static";

const app = new Hono();

app.use(logger());
app.use(appendTrailingSlash());
app.use(
  serveStatic({
    getContent: async (path, ctx) => {
      const { body } = await ctx.env.files.fetch(ctx.req.raw);
      return body;
    },
  }),
);

// クラスをそのままexportできない
// https://github.com/cloudflare/workerd/issues/699
export default {
  async fetch(req, env, ctx) {
    return app.fetch(req, env, ctx);
  },
};
