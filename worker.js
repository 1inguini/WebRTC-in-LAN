import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => c.text("Hello Cloudflare Workers!"));

// クラスをそのままexportできない
// https://github.com/cloudflare/workerd/issues/699
export default {
  async fetch(req, env, ctx) {
    return app.fetch(req, env, ctx);
  },
};
