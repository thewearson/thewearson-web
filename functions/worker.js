import { dropNotifyResponse, inboxSignup, dropTickResponse, dropStudioResponse, authMailResponse, fireDueDrops } from "./_lib.js";

export default {
  async fetch(request, env, ctx) {
    const path = new URL(request.url).pathname;
    if (path === "/api/drop-notify") {
      if (request.method !== "POST") return dropNotifyResponse(request, env);
      const clone = request.clone();
      const res = await dropNotifyResponse(request, env);
      if (res.ok) {
        const body = await clone.json().catch(() => ({}));
        if (body.off !== true && body.email) {
          ctx.waitUntil(inboxSignup(env, body.email).catch(() => {}));
        }
      }
      return res;
    }
    if (path === "/api/drop-tick") {
      return dropTickResponse(request, env);
    }
    if (path === "/api/drop-studio") {
      return dropStudioResponse(request, env, ctx);
    }
    if (path === "/api/auth-mail") {
      return authMailResponse(request, env);
    }
    if (env.ASSETS) {
      const url = new URL(request.url);
      const asset = await env.ASSETS.fetch(request);
      if (asset.status !== 404) return asset;
      if (request.method !== "GET" && request.method !== "HEAD") return asset;
      if (url.pathname.startsWith("/api/") || /\.[a-z0-9]+$/i.test(url.pathname)) return asset;
      return env.ASSETS.fetch(new Request(new URL("/index.html", url.origin), request));
    }
    return new Response("Not found", { status: 404 });
  },
  async scheduled(event, env, ctx) {
    ctx.waitUntil(fireDueDrops(env).catch((err) => console.log("drop-fire", err && err.message)));
  },
};
