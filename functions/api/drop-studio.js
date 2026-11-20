import { dropStudioResponse } from "../_lib.js";

export async function onRequest(context) {
  return dropStudioResponse(context.request, context.env);
}
