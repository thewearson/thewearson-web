export async function onRequest(context) {
  const origin = new URL(context.request.url).origin;
  const asset = await context.env.ASSETS.fetch(`${origin}/open`);
  const headers = new Headers(asset.headers);
  headers.set('cache-control', 'no-store');
  headers.delete('location');
  return new Response(asset.body, { status: 200, headers });
}
