import { dropNotifyResponse, inboxSignup, dropTickResponse, dropStudioResponse, authMailResponse } from "./_lib.js";

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
      return dropStudioResponse(request, env);
    }
    if (path === "/api/auth-mail") {
      return authMailResponse(request, env);
    }
    if (env.ASSETS) return env.ASSETS.fetch(request);
    return new Response("Not found", { status: 404 });
  },
};
