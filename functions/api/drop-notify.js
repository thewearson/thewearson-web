import { dropNotifyResponse } from "../_lib.js";

export async function onRequest(context) {
  return dropNotifyResponse(context.request, context.env);
}
