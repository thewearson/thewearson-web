import { dropNotifyResponse, inboxSignup } from "../_lib.js";

export async function onRequest(context) {
  const req = context.request;
  if (req.method !== "POST") return dropNotifyResponse(req, context.env);
  const clone = req.clone();
  const res = await dropNotifyResponse(req, context.env);
  if (res.ok) {
    const body = await clone.json().catch(() => ({}));
    if (body.off !== true && body.email) {
      context.waitUntil(inboxSignup(context.env, body.email).catch(() => {}));
    }
  }
  return res;
}
