// import { Hono } from "hono";

// const app = new Hono();

// app.get("/", (c) => c.text("Hello Cloudflare Workers!"));
// app.get("/:client", (c) => {
//   const { client } = c.req.param();
//   c.header("X-Message", "Hi!");
//   return c.text(`You want to see ${page} of ${id}`);
// });

import * as app from "@cloudflare/workers-shared";
export default {
  async fetch(req, env, ctx) {
    return app.fetch(req, env, ctx);
  },
};

// // クラスをそのままexportできない
// // https://github.com/cloudflare/workerd/issues/699
// export default {
//   async fetch(req, env, ctx) {
//     return app.fetch(req, env, ctx);
//   },
// };
