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
    if (cur.size >= 10000) return { ok: false, status: 429, data: { error: "List full." } };
    cur.add(email);
  }
  await savePack(env, { emails: [...cur], sent: !!pack.sent, cursor: pack.cursor || 0 });
  return { ok: true, status: 200, data: { n: cur.size } };
}

async function smtpSend(env, { recipients, subject, text, html, selfOnly }) {
  const user = String(env.GMAIL_USER || "thewears.on@gmail.com").trim();
  const pass = (await readSecret(env.GMAIL_APP_PASSWORD)).replace(/\s+/g, "");
  if (!pass) throw new Error("GMAIL_APP_PASSWORD missing");
  const toList = [...new Set((recipients || []).map(cleanEmail).filter(Boolean))];
  if (!selfOnly && !toList.length) return { ok: true, sent: 0 };
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

function dropStores(env) {
  const extra = Array.isArray(env && env.STORES) ? env.STORES : null;
  return extra && extra.length ? extra : VICE_STORES;
}

function dropMailSubject() {
  return "DROP LOCK OPENED — THE WEARS ON";
}

function dropMailText(env) {
  const newsId = env.VICE_NEWS_ID || "8cbc034c-8bee-4f9f-a7c9-9b32672e1e65";
  const stores = dropStores(env);
  return [
    "THE WEARS ON",
    "",
    "DROP LOCK OPENED",
    "MEMBER",
    "MIAMI HEAT × CACTUS JACK × NIKE × GTA VI",
    "20 NOV 2026 · 10:00 AM ET",
    "",
    ...stores.map((s) => `${s.label}: ${s.url}`),
    "",
    `https://thewearson.com/#/n/${newsId}`,
  ].join("\n");
}

function dropMailHtml(env) {
  const newsId = env.VICE_NEWS_ID || "8cbc034c-8bee-4f9f-a7c9-9b32672e1e65";
  const page = "https://thewearson.com/#/n/" + newsId;
  const stores = dropStores(env);
  const face = "'Inter Tight', Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif";
  const storeRows = stores.map((s, i) => {
    const on = i === 0;
    const border = i === stores.length - 1 ? "0" : "1.5px solid #000000";
    const bg = on ? "#000000" : "#ffffff";
    const fg = on ? "#ffffff" : "#000000";
    return `<tr>
      <td style="border-bottom:${border};padding:0;background:${bg}">
        <a href="${s.url}" style="display:block;padding:20px 16px;font-family:${face};font-size:12px;font-weight:900;letter-spacing:2.4px;line-height:1;text-transform:uppercase;color:${fg};text-decoration:none;text-align:center">${s.label}</a>
      </td>
    </tr>`;
  }).join("");
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@900&family=Inter:wght@900&display=swap" rel="stylesheet">
  <style>@import url("https://fonts.googleapis.com/css2?family=Inter+Tight:wght@900&family=Inter:wght@900&display=swap");</style>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;color:#000000">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f5f5">
    <tr>
      <td align="center" style="padding:36px 12px 48px">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:560px;max-width:560px;background:#000000">
          <tr>
            <td style="padding:0 0 10px 10px">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border:2px solid #000000;margin:-10px 10px 10px -10px">
                <tr>
                  <td align="center" height="56" style="height:56px;background:#000000;color:#ffffff;padding:18px 16px;font-family:${face};font-size:10px;font-weight:900;letter-spacing:2px;line-height:1">THE DROP CARD</td>
                </tr>
                <tr>
                  <td align="center" style="padding:36px 20px 28px">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="112">
                      <tr>
                        <td align="center" valign="middle" width="112" height="112" style="width:112px;height:112px;border:2.5px solid #000000;border-radius:56px;background:#f5f5f5">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
                            <tr>
                              <td align="center" style="padding:0 10px">
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="32" style="width:32px;border:5px solid #000000;border-bottom:0">
                                  <tr><td height="19" style="height:19px;font-size:0;line-height:0">&nbsp;</td></tr>
                                </table>
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="52" height="36" bgcolor="#000000" style="width:52px;height:36px;background:#000000">
                                  <tr>
                                    <td align="center" valign="middle" height="36" style="height:36px">
                                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="8" height="12" bgcolor="#f5f5f5" style="width:8px;height:12px;background:#f5f5f5">
                                        <tr><td height="12" style="height:12px;font-size:0;line-height:0">&nbsp;</td></tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    <h1 style="margin:20px 0 0;font-family:${face};font-size:48px;line-height:0.92;font-weight:900;letter-spacing:1.2px;text-transform:uppercase;color:#000000">DROP LOCK<br>OPENED</h1>
                    <span style="display:inline-block;margin-top:16px;padding:6px 10px;border:1.5px solid #000000;background:#000000;color:#ffffff;font-family:${face};font-size:8px;font-weight:900;letter-spacing:1.5px;line-height:1">MEMBER</span>
                    <p style="margin:18px 0 0;font-family:${face};font-size:11px;font-weight:900;letter-spacing:1.2px;line-height:1.25;text-transform:uppercase;color:#000000">MIAMI HEAT × CACTUS JACK × NIKE × GTA VI</p>
                    <p style="margin:10px 0 0;font-family:Inter, ${face};font-size:10px;font-weight:900;letter-spacing:1.8px;line-height:1.4;color:#000000">20 NOV 2026 · 10:00 AM ET</p>
                  </td>
                </tr>
                <tr>
                  <td style="border-top:1.5px solid #000000">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${storeRows}</table>
                  </td>
                </tr>
                <tr>
                  <td align="center" height="48" style="height:48px;background:#000000;color:#ffffff;padding:16px;font-family:${face};font-size:11px;font-weight:900;letter-spacing:2px;line-height:1">
                    <a href="${page}" style="color:#ffffff;text-decoration:none">THE WEARS ON</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function inboxSignup(env, email) {
  const addr = cleanEmail(email);
  if (!addr) return;
  const pass = (await readSecret(env.GMAIL_APP_PASSWORD)).replace(/\s+/g, "");
  if (!pass) return;
  await smtpSend(env, {
    recipients: [],
    selfOnly: true,
    subject: `DROP NOTIFY · ${addr}`,
    text: `ARMED\n${addr}\nDROP LOCK OPENED`,
    html: `<div style="font-family:Arial,Helvetica,sans-serif;font-weight:900;letter-spacing:1px">ARMED<br>${addr}<br>DROP LOCK OPENED</div>`,
  });
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
  const emails = Array.isArray(pack.emails) ? pack.emails : [];
  if (!emails.length) return { sent: 0 };
  const cursor = Math.max(0, Number(pack.cursor || 0) || 0);
  if (pack.sent && cursor >= emails.length && !opt.force) return { already: true };
  const start = opt.force ? 0 : cursor;
  const batch = emails.slice(start, start + 40);
  if (!batch.length) {
    await savePack(env, { emails, sent: true, cursor: emails.length });
    return { sent: 0, done: true };
  }
  const subject = dropMailSubject();
  const text = dropMailText(env);
  const html = dropMailHtml(env);
  const hook = await readSecret(env.DROP_MAIL_HOOK);
  if (hook) {
    const res = await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fire: true, emails: batch, html, text, subject }),
    });
    if (!res.ok) throw new Error(`mail hook ${res.status}`);
  } else {
    await smtpSend(env, { recipients: batch, subject, text, html });
  }
  const next = start + batch.length;
  const done = next >= emails.length;
  await savePack(env, { emails, sent: done, cursor: next });
  return { sent: batch.length, cursor: next, done, total: emails.length };
}

export async function dropTickResponse(request, env) {
  if (request.method === "OPTIONS") return preflight(request);
  if (request.method !== "POST") return corsJson(request, 405, { error: "POST only." });
  let body = {};
  try { body = await request.json(); } catch { body = {}; }
  try {
    const out = await sendDueDropMail(env, { live: body.live === true });
    return corsJson(request, 200, { ok: true, ...out });
  } catch (err) {
    return corsJson(request, 500, { error: String(err && err.message || err) });
  }
}
