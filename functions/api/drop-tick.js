import { dropTickResponse } from "../_lib.js";

export async function onRequest(context) {
  return dropTickResponse(context.request, context.env);
}
