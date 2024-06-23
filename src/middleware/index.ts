import { defineMiddleware } from "astro:middleware";

//* context.locals 就像koa中的ctx.state,用于在请求处理过程中被传递, 并且可以在astro中通过Astro.locals访问
export const onRequest = defineMiddleware(async (context, next) => {
  // const cookie = context.cookies.get("counter");
  if (!context.locals.title) context.locals.title = "Astro";
  // return next();
  console.time("onRequest: " + context.url.pathname);
  await next();
  console.timeEnd("onRequest: " + context.url.pathname);
});
