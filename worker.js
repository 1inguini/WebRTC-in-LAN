import { Hono } from "hono";
import { serveStatic } from "hono/serve-static";
import mimeDB from "mime-db/db.json";

const app = new Hono();

const extDB = {};
for (const [mime, v] of Object.entries(mimeDB)) {
  for (const ext of v.extensions ?? []) {
    extDB[ext] ??= {
      contentType: v.charset
        ? `${mime};charset=${v.charset.toLowerCase()}`
        : mime,
      ...v,
    };
  }
}

app.use(
  serveStatic({
    getContent: async (path, ctx) => {
      const { body } = await ctx.env.files.fetch(ctx.req.raw);
      const res = new Response(body, {
        headers: {
          "Content-Type":
            extDB[path.split(".").pop()].contentType ??
            "application/octet-stream",
        },
      });
      return res;
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
