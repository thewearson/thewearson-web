const VICE_STORES = [
  { label: "NBA Store", url: "https://store.nba.com" },
  { label: "Fanatics", url: "https://www.fanatics.com/nba/o-1370+z-938737729-293541727" },
  { label: "Nike SNKRS", url: "https://www.nike.com/launch" },
  { label: "Cactus Jack", url: "https://shop.travisscott.com" },
];

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

function corsJson(request, status, obj) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...corsHeaders(request) },
  });
}

function json(status, obj) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
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
  if (!env.DROP_NOTIFY) return null;
  return env.DROP_NOTIFY.get(env.DROP_NOTIFY.idFromName("inbox"));
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
  const page = "https://thewearson.com/#/n/" + (env.VICE_NEWS_ID || "");
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

async function dropNotifyResponse(request, env) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(request) });
  if (request.method !== "POST") return corsJson(request, 405, { error: "POST only." });
  let body = {};
  try { body = await request.json(); } catch { return corsJson(request, 400, { error: "Bad JSON." }); }
  const email = cleanEmail(body.email);
  const newsId = String(body.newsId || env.VICE_NEWS_ID || "").trim();
  const off = body.off === true;
  if (!email) return corsJson(request, 400, { error: "Email required." });
  if (!newsId) return corsJson(request, 400, { error: "Drop required." });
  const stub = dropStub(env);
  if (!stub) return corsJson(request, 503, { error: "Notify inbox missing." });
  const res = await stub.fetch("https://drop.notify/sub", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newsId, off, at: body.at || env.VICE_AT }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return corsJson(request, res.status, data);
  return corsJson(request, 200, { ok: true, on: !off });
}

async function sendDueDropMail(env, opt = {}) {
  const at = Date.parse(env.VICE_AT || "2026-11-20T15:00:00Z");
  if (!Number.isFinite(at) || (Date.now() < at && !opt.force)) return { skipped: true };
  const stub = dropStub(env);
  if (!stub) return { error: "no inbox" };
  const listed = await stub.fetch("https://drop.notify/list");
  const pack = await listed.json().catch(() => ({}));
  if (pack.sent && !opt.force) return { already: true };
  const emails = Array.isArray(pack.emails) ? pack.emails : [];
  if (!emails.length) return { sent: 0 };
  const subject = "🚨 DROP IS LIVE — THE WEARS ON";
  const text = `DROP IS LIVE.\n\n${VICE_STORES.map((s) => `${s.label}: ${s.url}`).join("\n")}\n\nhttps://thewearson.com/#/n/${env.VICE_NEWS_ID || ""}`;
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
  await stub.fetch("https://drop.notify/sent", { method: "POST" });
  return { sent: emails.length };
}

async function dropTickResponse(request, env) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(request) });
  if (request.method !== "POST") return corsJson(request, 405, { error: "POST only." });
  try {
    const out = await sendDueDropMail(env);
    return corsJson(request, 200, { ok: true, ...out });
  } catch (err) {
    return corsJson(request, 500, { error: String(err && err.message || err) });
  }
}

export class DropNotify {
  constructor(state) {
    this.state = state;
  }
  async fetch(request) {
    const path = new URL(request.url).pathname;
    if (request.method === "GET" || path.endsWith("/list")) {
      const emails = (await this.state.storage.get("emails")) || [];
      const sent = (await this.state.storage.get("sent")) || false;
      return json(200, { emails, sent });
    }
    if (path.endsWith("/sent") && request.method === "POST") {
      await this.state.storage.put("sent", true);
      return json(200, { ok: true });
    }
    let body = {};
    try { body = await request.json(); } catch { body = {}; }
    const email = cleanEmail(body.email);
    const off = body.off === true;
    if (!email) return json(400, { error: "Email required." });
    const cur = new Set((await this.state.storage.get("emails")) || []);
    if (off) cur.delete(email);
    else {
      if (cur.size >= 2000) return json(429, { error: "List full." });
      cur.add(email);
    }
    await this.state.storage.put("emails", [...cur]);
    if (body.at) await this.state.storage.put("at", String(body.at));
    return json(200, { ok: true, n: cur.size });
  }
}

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname.replace(/\/$/, "") || "/";
    if (path === "/api/drop-notify") return dropNotifyResponse(request, env);
    if (path === "/api/drop-tick") return dropTickResponse(request, env);
    if (env.ASSETS) return env.ASSETS.fetch(request);
    return new Response("Not found", { status: 404 });
  },
  async scheduled(event, env, ctx) {
    ctx.waitUntil(sendDueDropMail(env).catch((err) => console.log("drop-mail", err && err.message)));
  },
};
