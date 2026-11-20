const VICE_STORES = [
  { id: "nba", label: "NBA Store", url: "https://store.nba.com" },
  { id: "fanatics", label: "Fanatics", url: "https://www.fanatics.com/nba/o-1370+z-938737729-293541727" },
  { id: "nike", label: "Nike SNKRS", url: "https://www.nike.com/launch" },
  { id: "cactus", label: "Cactus Jack", url: "https://shop.travisscott.com" },
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

function emptyPack() {
  return { emails: [], sent: false, lockDone: false, cursor: 0, sentStoreIds: [], wave: null };
}

async function loadPack(env) {
  const stub = dropStub(env);
  if (stub) {
    const listed = await stub.fetch("https://drop.notify/list");
    const raw = await listed.json().catch(() => ({}));
    return { ...emptyPack(), ...raw };
  }
  const hit = await caches.default.match(CACHE_REQ);
  if (!hit) return emptyPack();
  const raw = await hit.json().catch(() => ({}));
  return { ...emptyPack(), ...raw };
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
  await savePack(env, { ...pack, emails: [...cur] });
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

const SB_URL = "https://ctldtidtnvctxoquextm.supabase.co";
const SB_KEY = "sb_publishable_t3zzhT3K_iR0FWuFCA4-Ow_Rdn8zsQk";

function escHtml(s) {
  return String(s || "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function hrefAbs(raw) {
  const s = String(raw || "").trim();
  if (!s) return "";
  const url = /^https?:\/\//i.test(s) ? s : `https://${s.replace(/^\/+/, "")}`;
  if (!/^https?:\/\//i.test(url)) return "";
  return url.replace(/"/g, "%22");
}

function storeId(label, url, fallback) {
  const s = `${label} ${url}`.toLowerCase();
  if (/nike|snkrs/.test(s)) return "nike";
  if (/fanatics/.test(s)) return "fanatics";
  if (/nba/.test(s)) return "nba";
  if (/cactus|travis/.test(s)) return "cactus";
  return fallback || String(label || "store").toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 18) || "store";
}

function parseDropJson(raw) {
  if (!raw) return null;
  if (typeof raw === "object" && !Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try { return JSON.parse(raw); } catch { return null; }
  }
  return null;
}

function parseDropNote(note) {
  const lines = String(note || "").split(/\r?\n/);
  const stores = [];
  let at = "";
  let off = false;
  for (const line of lines) {
    const t0 = line.trim();
    if (!t0) continue;
    if (/^AT\s+OFF$/i.test(t0) || /^DROP_OFF$/i.test(t0)) { off = true; continue; }
    const atM = t0.match(/^AT\s+(\d{4}-\d{2}-\d{2}T[\d:.]+Z?)\s*$/i);
    if (atM) { at = atM[1].endsWith("Z") ? atM[1] : `${atM[1]}Z`; continue; }
    const sm = t0.match(/^(.+?)\s+(https?:\/\/\S+)\s*$/i);
    if (sm) stores.push({ label: sm[1].trim(), url: sm[2].trim() });
  }
  return { at, stores, off };
}

function normalizeStores(list) {
  const out = [];
  const seen = new Set();
  for (const s of (Array.isArray(list) ? list : []).slice(0, 6)) {
    const url = hrefAbs(s?.url || s?.href || "");
    const label = String(s?.label || s?.name || s?.store || "").trim();
    if (!url || !label) continue;
    const id = String(s?.id || storeId(label, url, `s${out.length + 1}`));
    if (seen.has(id)) continue;
    seen.add(id);
    out.push({ id, label, url });
  }
  return out;
}

function formatWhen(iso) {
  const ms = Date.parse(iso);
  if (!Number.isFinite(ms)) return "20 NOV 2026 · 10:00 AM ET";
  try {
    const d = new Date(ms).toLocaleString("en-US", {
      timeZone: "America/New_York",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).toUpperCase();
    return `${d} ET`;
  } catch {
    return "20 NOV 2026 · 10:00 AM ET";
  }
}

async function loadLiveDrop(env) {
  const newsId = env.VICE_NEWS_ID || "8cbc034c-8bee-4f9f-a7c9-9b32672e1e65";
  const fallback = {
    newsId,
    at: env.VICE_AT || "2026-11-20T15:00:00Z",
    title: "MIAMI HEAT × CACTUS JACK × NIKE × GTA VI",
    when: "20 NOV 2026 · 10:00 AM ET",
    stores: normalizeStores(VICE_STORES),
    on: true,
  };
  const sb = String(env.SUPABASE_URL || env.WEARS_SUPABASE_URL || SB_URL).replace(/\/$/, "");
  const key = env.SUPABASE_ANON_KEY || env.WEARS_SUPABASE_ANON_KEY || SB_KEY;
  let row = null;
  try {
    const res = await fetch(`${sb}/rest/v1/drip_news?id=eq.${encodeURIComponent(newsId)}&select=id,title,product_name,drop_json,buy_note,buy_url`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    const rows = await res.json().catch(() => []);
    row = Array.isArray(rows) ? rows[0] : null;
  } catch {
    row = null;
  }
  if (!row) return fallback;
  const json = parseDropJson(row.drop_json);
  const packed = parseDropNote(row.buy_note);
  const stores = normalizeStores(json?.stores?.length ? json.stores : packed.stores.length ? packed.stores : VICE_STORES);
  const at = String(json?.at || packed.at || fallback.at);
  const title = String(json?.title || row.product_name || row.title || fallback.title);
  return {
    newsId,
    at,
    title,
    when: formatWhen(at),
    stores,
    on: json?.on !== false && !packed.off,
  };
}

function dropMailSubject(stores) {
  const one = Array.isArray(stores) && stores.length === 1 ? stores[0].label : "";
  return one ? `DROP LOCK OPENED — ${String(one).toUpperCase()}` : "DROP LOCK OPENED — THE WEARS ON";
}

function dropMailText(wave) {
  const newsId = wave.newsId || "8cbc034c-8bee-4f9f-a7c9-9b32672e1e65";
  const stores = Array.isArray(wave.stores) ? wave.stores : [];
  return [
    "THE WEARS ON",
    "",
    "DROP LOCK OPENED",
    "MEMBER",
    String(wave.title || "MIAMI HEAT × CACTUS JACK × NIKE × GTA VI").toUpperCase(),
    wave.when || "20 NOV 2026 · 10:00 AM ET",
    "",
    ...stores.map((s) => `${s.label}: ${s.url}`),
    "",
    `https://thewearson.com/#/n/${newsId}`,
  ].join("\n");
}

function dropMailHtml(wave) {
  const newsId = wave.newsId || "8cbc034c-8bee-4f9f-a7c9-9b32672e1e65";
  const page = "https://thewearson.com/#/n/" + newsId;
  const stores = Array.isArray(wave.stores) ? wave.stores : [];
  const title = escHtml(String(wave.title || "MIAMI HEAT × CACTUS JACK × NIKE × GTA VI").toUpperCase());
  const when = escHtml(wave.when || "20 NOV 2026 · 10:00 AM ET");
  const face = "'Inter Tight', Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif";
  const storeRows = stores.map((s, i) => {
    const on = i === 0;
    const border = i === stores.length - 1 ? "0" : "1.5px solid #000000";
    const bg = on ? "#000000" : "#ffffff";
    const fg = on ? "#ffffff" : "#000000";
    return `<tr>
      <td style="border-bottom:${border};padding:0;background:${bg}">
        <a href="${hrefAbs(s.url)}" style="display:block;padding:20px 16px;font-family:${face};font-size:12px;font-weight:900;letter-spacing:2.4px;line-height:1;text-transform:uppercase;color:${fg};text-decoration:none;text-align:center">${escHtml(s.label)}</a>
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
                    <p style="margin:18px 0 0;font-family:${face};font-size:11px;font-weight:900;letter-spacing:1.2px;line-height:1.25;text-transform:uppercase;color:#000000">${title}</p>
                    <p style="margin:10px 0 0;font-family:Inter, ${face};font-size:10px;font-weight:900;letter-spacing:1.8px;line-height:1.4;color:#000000">${when}</p>
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

function sameSecret(a, b) {
  const x = String(a || "");
  const y = String(b || "");
  if (!x || !y || x.length !== y.length) return false;
  let out = 0;
  for (let i = 0; i < x.length; i += 1) out |= x.charCodeAt(i) ^ y.charCodeAt(i);
  return out === 0;
}

async function studioAuthorized(request, env) {
  const got = String(request.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "").trim();
  if (!got) return false;
  const keys = [
    await readSecret(env.DROP_STUDIO_KEY),
    await readSecret(env.GMAIL_APP_PASSWORD),
  ].filter(Boolean);
  return keys.some((k) => sameSecret(got, k));
}

function waveKey(storeIds, early) {
  const ids = [...new Set((storeIds || []).map(String))].sort();
  return `${early ? "early" : "lock"}:${ids.join("+") || "none"}`;
}

async function sendWave(env, pack, emails, wave, sentStoreIds) {
  const stores = Array.isArray(wave.stores) ? wave.stores : [];
  if (!stores.length) return { error: "No stores on card." };
  if (!emails.length) {
    return { sent: 0, done: true, empty: true, storeIds: wave.storeIds || [], sentStoreIds };
  }
  const start = Math.max(0, Number(wave.cursor || 0) || 0);
  const batch = emails.slice(start, start + 40);
  if (!batch.length) {
    const nextSent = [...new Set([...sentStoreIds, ...(wave.storeIds || [])])];
    await savePack(env, {
      ...pack,
      emails,
      sentStoreIds: nextSent,
      lockDone: !!(pack.lockDone || !wave.early),
      wave: { ...wave, cursor: emails.length, done: true },
    });
    return { sent: 0, done: true, storeIds: wave.storeIds || [], sentStoreIds: nextSent, total: emails.length };
  }
  const subject = dropMailSubject(stores);
  const text = dropMailText(wave);
  const html = dropMailHtml(wave);
  const hook = await readSecret(env.DROP_MAIL_HOOK);
  if (hook) {
    const res = await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fire: true, emails: batch, html, text, subject, storeIds: wave.storeIds || [] }),
    });
    if (!res.ok) throw new Error(`mail hook ${res.status}`);
  } else {
    await smtpSend(env, { recipients: batch, subject, text, html });
  }
  const next = start + batch.length;
  const done = next >= emails.length;
  const nextSent = done ? [...new Set([...sentStoreIds, ...(wave.storeIds || [])])] : sentStoreIds;
  await savePack(env, {
    ...pack,
    emails,
    sentStoreIds: nextSent,
    lockDone: !!(pack.lockDone || (done && !wave.early)),
    wave: { ...wave, cursor: next, done },
  });
  return {
    sent: batch.length,
    cursor: next,
    done,
    total: emails.length,
    storeIds: wave.storeIds || [],
    sentStoreIds: nextSent,
    early: !!wave.early,
  };
}

export async function sendDueDropMail(env, opt = {}) {
  const pack = await loadPack(env);
  const emails = Array.isArray(pack.emails) ? pack.emails : [];
  const sentStoreIds = [...new Set((pack.sentStoreIds || []).map(String))];
  let wave = pack.wave && typeof pack.wave === "object" ? pack.wave : null;
  const studioIds = (opt.studio && Array.isArray(opt.storeIds) ? opt.storeIds : [])
    .map((s) => String(s || "").trim())
    .filter(Boolean);

  if (wave && !wave.done && Array.isArray(wave.stores) && wave.stores.length) {
    if (studioIds.length && waveKey(studioIds, true) !== wave.key) {
      return { busy: true, wave: { key: wave.key, storeIds: wave.storeIds, cursor: wave.cursor, done: false } };
    }
    return sendWave(env, pack, emails, wave, sentStoreIds);
  }

  const live = await loadLiveDrop(env);

  if (studioIds.length) {
    const want = new Set(studioIds);
    const stores = (live.stores || []).filter((s) => want.has(s.id) && s.url);
    if (!stores.length) return { error: "No matching live store URLs. Save the dispatch first." };
    const ids = stores.map((s) => s.id);
    if (!opt.again && ids.every((id) => sentStoreIds.includes(id))) {
      return { already: true, sentStoreIds, storeIds: ids };
    }
    wave = {
      key: waveKey(ids, true),
      stores,
      storeIds: ids,
      title: live.title,
      when: live.when,
      newsId: live.newsId,
      cursor: 0,
      done: false,
      early: true,
    };
    return sendWave(env, pack, emails, wave, sentStoreIds);
  }

  const at = Date.parse(live.at || env.VICE_AT || "2026-11-20T15:00:00Z");
  if (!Number.isFinite(at) || (Date.now() < at && !opt.force)) return { skipped: true };
  if (!live.on) return { skipped: true, off: true };
  const stores = (live.stores || []).filter((s) => s.url && !sentStoreIds.includes(s.id));
  if (!stores.length) return { already: true, done: true, sentStoreIds };
  wave = {
    key: waveKey(stores.map((s) => s.id), false),
    stores,
    storeIds: stores.map((s) => s.id),
    title: live.title,
    when: live.when,
    newsId: live.newsId,
    cursor: 0,
    done: false,
    early: false,
  };
  return sendWave(env, pack, emails, wave, sentStoreIds);
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

export async function dropStudioResponse(request, env) {
  if (request.method === "OPTIONS") return preflight(request);
  if (!(await studioAuthorized(request, env))) {
    return corsJson(request, 401, { error: "Studio auth failed." });
  }
  if (request.method === "GET") {
    const pack = await loadPack(env);
    return corsJson(request, 200, {
      ok: true,
      n: (pack.emails || []).length,
      sentStoreIds: pack.sentStoreIds || [],
      lockDone: !!pack.lockDone,
      wave: pack.wave ? {
        key: pack.wave.key,
        done: !!pack.wave.done,
        cursor: pack.wave.cursor || 0,
        storeIds: pack.wave.storeIds || [],
        early: !!pack.wave.early,
      } : null,
    });
  }
  if (request.method !== "POST") return corsJson(request, 405, { error: "POST or GET." });
  let body = {};
  try { body = await request.json(); } catch { body = {}; }
  const storeIds = Array.isArray(body.storeIds)
    ? body.storeIds.map((s) => String(s || "").trim()).filter(Boolean).slice(0, 6)
    : [];
  if (!storeIds.length) return corsJson(request, 400, { error: "storeIds required." });
  try {
    const out = await sendDueDropMail(env, { studio: true, storeIds, again: body.again === true });
    const status = out.error ? 400 : 200;
    return corsJson(request, status, { ok: !out.error, ...out });
  } catch (err) {
    return corsJson(request, 500, { error: String(err && err.message || err) });
  }
}
