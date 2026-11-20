const VICE_STORES = [
  { label: "NBA Store", url: "https://store.nba.com" },
  { label: "Fanatics", url: "https://www.fanatics.com/nba/o-1370+z-938737729-293541727" },
  { label: "Nike SNKRS", url: "https://www.nike.com/launch" },
  { label: "Cactus Jack", url: "https://shop.travisscott.com" },
];

const CACHE_REQ = new Request("https://thewearson.com/__drop-notify-inbox");

function corsHeaders(request) {
  const origin = String(request.headers.get("Origin") || "");
  const allow = /^https:\/\/(www\.)?thewearson\.com$/.test(origin)
    || /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(origin)
    ? origin
    : "https://thewearson.com";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export function corsJson(request, status, obj) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...corsHeaders(request) },
  });
}

export function preflight(request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

function cleanEmail(raw) {
  const s = String(raw || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) || s.length > 180) return "";
  return s;
}

async function readSecret(value) {
  if (value == null || value === "") return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "object" && typeof value.get === "function") {
    try {
      const got = await value.get();
      return typeof got === "string" ? got.trim() : "";
    } catch {
      return "";
    }
  }
  return "";
}

function b64utf8(s) {
  const bytes = new TextEncoder().encode(String(s || ""));
  let bin = "";
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin);
}

function dropStub(env) {
  if (!env || !env.DROP_NOTIFY) return null;
  return env.DROP_NOTIFY.get(env.DROP_NOTIFY.idFromName("inbox"));
}

async function loadPack(env) {
  const stub = dropStub(env);
  if (stub) {
    const listed = await stub.fetch("https://drop.notify/list");
    return listed.json().catch(() => ({ emails: [], sent: false }));
  }
  const hit = await caches.default.match(CACHE_REQ);
  if (!hit) return { emails: [], sent: false };
  return hit.json().catch(() => ({ emails: [], sent: false }));
}

async function savePack(env, pack) {
  const stub = dropStub(env);
  if (stub) {
    if (pack.sent) {
      await stub.fetch("https://drop.notify/sent", { method: "POST" });
      return;
    }
    return;
  }
  await caches.default.put(CACHE_REQ, new Response(JSON.stringify(pack), {
    headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=2592000" },
  }));
}

async function upsertEmail(env, email, off) {
  const stub = dropStub(env);
  if (stub) {
    const res = await stub.fetch("https://drop.notify/sub", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, off }),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  }
  const pack = await loadPack(env);
  const cur = new Set(Array.isArray(pack.emails) ? pack.emails : []);
  if (off) cur.delete(email);
  else {
    if (cur.size >= 2000) return { ok: false, status: 429, data: { error: "List full." } };
    cur.add(email);
  }
  await savePack(env, { emails: [...cur], sent: !!pack.sent });
  return { ok: true, status: 200, data: { n: cur.size } };
}

async function smtpSend(env, { recipients, subject, text, html }) {
  const user = String(env.GMAIL_USER || "thewears.on@gmail.com").trim();
  const pass = (await readSecret(env.GMAIL_APP_PASSWORD)).replace(/\s+/g, "");
  if (!pass) throw new Error("GMAIL_APP_PASSWORD missing");
  const toList = [...new Set((recipients || []).map(cleanEmail).filter(Boolean))];
  if (!toList.length) return { ok: true, sent: 0 };
  const { connect } = await import("cloudflare:sockets");
  const socket = connect({ hostname: "smtp.gmail.com", port: 465 }, { secureTransport: "on" });
  const reader = socket.readable.getReader();
  const writer = socket.writable.getWriter();
  const dec = new TextDecoder();
  const enc = new TextEncoder();
  let buf = "";
  async function readReply() {
    while (true) {
      const { value, done } = await reader.read();
      if (done) throw new Error("SMTP closed");
      buf += dec.decode(value, { stream: true });
      const parts = buf.split(/\r?\n/);
      buf = parts.pop() || "";
      for (const line of parts) {
        const m = /^(\d{3})([ -])/.exec(line);
        if (m && m[2] === " ") return { code: Number(m[1]), line };
      }
    }
  }
  async function cmd(line) {
    await writer.write(enc.encode(`${line}\r\n`));
    return readReply();
  }
  try {
    const greet = await readReply();
    if (greet.code !== 220) throw new Error(greet.line);
    let r = await cmd("EHLO thewearson.com");
    if (r.code !== 250) throw new Error(r.line);
    r = await cmd("AUTH LOGIN");
    if (r.code !== 334) throw new Error(r.line);
    r = await cmd(btoa(user));
    if (r.code !== 334) throw new Error(r.line);
    r = await cmd(btoa(pass));
    if (r.code !== 235) throw new Error("Gmail auth failed. Use an App Password.");
    r = await cmd(`MAIL FROM:<${user}>`);
    if (r.code !== 250) throw new Error(r.line);
    r = await cmd(`RCPT TO:<${user}>`);
    if (r.code !== 250) throw new Error(r.line);
    for (const to of toList) {
      r = await cmd(`RCPT TO:<${to}>`);
      if (r.code !== 250 && r.code !== 251) throw new Error(`${to}: ${r.line}`);
    }
    r = await cmd("DATA");
    if (r.code !== 354) throw new Error(r.line);
    const payload = [
      `From: THE WEARS ON <${user}>`,
      `To: THE WEARS ON <${user}>`,
      `Subject: =?UTF-8?B?${b64utf8(subject)}?=`,
      "MIME-Version: 1.0",
      "Content-Type: text/html; charset=UTF-8",
      "Content-Transfer-Encoding: 8bit",
      "",
      html || String(text || "").replace(/\n/g, "<br>"),
      "",
    ].join("\r\n").replace(/^\./gm, "..");
    await writer.write(enc.encode(`${payload}\r\n.\r\n`));
    r = await readReply();
    if (r.code !== 250) throw new Error(r.line);
    await cmd("QUIT");
    return { ok: true, sent: toList.length };
  } finally {
    try { reader.releaseLock(); } catch { /* ignore */ }
    try { await writer.close(); } catch { /* ignore */ }
    try { socket.close(); } catch { /* ignore */ }
  }
}

function dropMailHtml(env) {
  const newsId = env.VICE_NEWS_ID || "8cbc034c-8bee-4f9f-a7c9-9b32672e1e65";
  const page = "https://thewearson.com/#/n/" + newsId;
  const stores = VICE_STORES.map((s) => `<p style="margin:0 0 10px"><a href="${s.url}" style="color:#111;font-weight:900;letter-spacing:1px;text-decoration:none;border-bottom:1.5px solid #111">${s.label}</a></p>`).join("");
  return `<!doctype html><html><body style="margin:0;background:#fff;color:#111;font-family:Arial,sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:28px 20px;border:2px solid #111">
    <p style="margin:0 0 8px;font-size:11px;font-weight:900;letter-spacing:2px">THE WEARS ON</p>
    <h1 style="margin:0 0 12px;font-size:28px;line-height:1.1;text-transform:uppercase">Drop is live. Shop now.</h1>
    <p style="margin:0 0 20px;font-size:13px;font-weight:700;letter-spacing:1px">20 NOV 2026 · 10:00 AM ET · 18:00 TSİ</p>
    ${stores}
    <p style="margin:24px 0 0"><a href="${page}" style="display:inline-block;padding:14px 18px;background:#111;color:#fff;font-weight:900;letter-spacing:1.4px;text-decoration:none">OPEN THE DROP</a></p>
  </div>
  </body></html>`;
}

export async function dropNotifyResponse(request, env) {
  if (request.method === "OPTIONS") return preflight(request);
  if (request.method !== "POST") return corsJson(request, 405, { error: "POST only." });
  let body = {};
  try { body = await request.json(); } catch { return corsJson(request, 400, { error: "Bad JSON." }); }
  const email = cleanEmail(body.email);
  if (!email) return corsJson(request, 400, { error: "Email required." });
  const out = await upsertEmail(env, email, body.off === true);
  if (!out.ok) return corsJson(request, out.status, out.data);
  return corsJson(request, 200, { ok: true, on: body.off !== true });
}

export async function sendDueDropMail(env, opt = {}) {
  const at = Date.parse(env.VICE_AT || "2026-11-20T15:00:00Z");
  if (!Number.isFinite(at) || (Date.now() < at && !opt.force)) return { skipped: true };
  const pack = await loadPack(env);
  if (pack.sent && !opt.force) return { already: true };
  const emails = Array.isArray(pack.emails) ? pack.emails : [];
  if (!emails.length) return { sent: 0 };
  const newsId = env.VICE_NEWS_ID || "8cbc034c-8bee-4f9f-a7c9-9b32672e1e65";
  const subject = "🚨 DROP IS LIVE — THE WEARS ON";
  const text = `DROP IS LIVE.\n\n${VICE_STORES.map((s) => `${s.label}: ${s.url}`).join("\n")}\n\nhttps://thewearson.com/#/n/${newsId}`;
  const hook = await readSecret(env.DROP_MAIL_HOOK);
  if (hook) {
    const res = await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fire: true, emails, html: dropMailHtml(env), text, subject }),
    });
    if (!res.ok) throw new Error(`mail hook ${res.status}`);
  } else {
    await smtpSend(env, { recipients: emails, subject, text, html: dropMailHtml(env) });
  }
  await savePack(env, { emails, sent: true });
  const stub = dropStub(env);
  if (stub) await stub.fetch("https://drop.notify/sent", { method: "POST" });
  return { sent: emails.length };
}

export async function dropTickResponse(request, env) {
  if (request.method === "OPTIONS") return preflight(request);
  if (request.method !== "POST") return corsJson(request, 405, { error: "POST only." });
  try {
    const out = await sendDueDropMail(env);
    return corsJson(request, 200, { ok: true, ...out });
  } catch (err) {
    return corsJson(request, 500, { error: String(err && err.message || err) });
  }
}
