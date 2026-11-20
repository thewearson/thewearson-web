const VICE_NEWS_ID = "8cbc034c-8bee-4f9f-a7c9-9b32672e1e65";
const AF1_NEWS_ID = "75460ba6-0d53-402b-ad25-7a5a5a36dc7e";
const AF1_SHAPE_ID = "93e33b2f-e4e0-494d-b43d-34609210ab13";
const AF1_NEWS_IDS = [AF1_NEWS_ID, AF1_SHAPE_ID];
const AF1_AT = "2026-11-21T15:00:00Z";
const VICE_STORES = [
  { id: "nba", label: "NBA Store", url: "https://store.nba.com" },
  { id: "fanatics", label: "Fanatics", url: "https://www.fanatics.com/nba/o-1370+z-938737729-293541727" },
  { id: "nike", label: "Nike SNKRS", url: "https://www.nike.com/launch" },
  { id: "cactus", label: "Cactus Jack", url: "https://shop.travisscott.com" },
];
const AF1_STORES = [
  { id: "snkrs", label: "Nike SNKRS", url: "https://www.nike.com/launch" },
  { id: "cactus", label: "Cactus Jack", url: "https://shop.travisscott.com" },
];

const CACHE_REQ = new Request("https://thewearson.com/__drop-notify-inbox");
const INDEX_REQ = new Request("https://thewearson.com/__drop-notify-index");

function cleanNewsId(raw, env) {
  const s = String(raw || "").trim().toLowerCase();
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(s)) return s;
  return String(env && env.VICE_NEWS_ID || VICE_NEWS_ID);
}

function isAf1Id(id) {
  return AF1_NEWS_IDS.includes(String(id || "").toLowerCase());
}

function packId(raw, env) {
  const id = cleanNewsId(raw, env);
  return isAf1Id(id) ? AF1_NEWS_ID : id;
}

function packRequest(newsId) {
  return new Request(`https://thewearson.com/__drop-notify-inbox/${newsId}`);
}

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

async function loadIndex(env) {
  const hit = await caches.default.match(INDEX_REQ);
  const raw = hit ? await hit.json().catch(() => ({})) : {};
  const ids = [...new Set([VICE_NEWS_ID, AF1_NEWS_ID, ...((raw && raw.ids) || [])].map((id) => packId(id, env)))];
  return { ids };
}

async function rememberNews(env, newsId) {
  const id = packId(newsId, env);
  const idx = await loadIndex(env);
  if (idx.ids.includes(id)) return;
  idx.ids.push(id);
  await caches.default.put(INDEX_REQ, new Response(JSON.stringify(idx), {
    headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=2592000" },
  }));
}

async function readCachePack(newsId) {
  const hit = await caches.default.match(packRequest(newsId));
  if (!hit) return null;
  const raw = await hit.json().catch(() => ({}));
  return raw && typeof raw === "object" ? raw : null;
}

function mergePacks(base, extra) {
  const a = { ...emptyPack(), ...(base || {}) };
  const b = extra && typeof extra === "object" ? extra : {};
  const emails = [...new Set([...(a.emails || []), ...(b.emails || [])])];
  const sentStoreIds = [...new Set([...(a.sentStoreIds || []), ...(b.sentStoreIds || [])].map(String))];
  return {
    ...a,
    emails,
    sentStoreIds,
    lockDone: !!(a.lockDone || b.lockDone),
    sent: !!(a.sent || b.sent),
    wave: a.wave && !a.wave.done ? a.wave : (b.wave && !b.wave.done ? b.wave : a.wave || b.wave || null),
  };
}

async function loadPack(env, newsId) {
  const id = packId(newsId, env);
  const stub = dropStub(env);
  if (stub) {
    const listed = await stub.fetch("https://drop.notify/list");
    const raw = await listed.json().catch(() => ({}));
    return { ...emptyPack(), ...raw };
  }
  let pack = { ...emptyPack(), ...(await readCachePack(id) || {}) };
  if (id === VICE_NEWS_ID) {
    const legacy = await caches.default.match(CACHE_REQ);
    if (legacy) pack = mergePacks(pack, await legacy.json().catch(() => ({})));
  }
  if (id === AF1_NEWS_ID) {
    for (const extra of AF1_NEWS_IDS) {
      if (extra === id) continue;
      pack = mergePacks(pack, await readCachePack(extra));
    }
  }
  return pack;
}

async function savePack(env, pack, newsId) {
  const id = packId(newsId || (pack && pack.newsId), env);
  const stub = dropStub(env);
  if (stub) {
    if (pack.sent) {
      await stub.fetch("https://drop.notify/sent", { method: "POST" });
      return;
    }
    return;
  }
  const body = new Response(JSON.stringify({ ...pack, newsId: id }), {
    headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=2592000" },
  });
  await caches.default.put(packRequest(id), body.clone());
  if (id === VICE_NEWS_ID) await caches.default.put(CACHE_REQ, body);
}

async function rpcDropPut(env, pack, email, off) {
  try {
    const r = await fetch(`${SB_URL}/rest/v1/rpc/wears_drop_notify_put`, {
      method: "POST",
      headers: {
        apikey: SB_KEY,
        Authorization: `Bearer ${SB_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_pack: pack, p_email: email, p_off: !!off }),
    });
    const data = await r.json().catch(() => ({}));
    return { ok: r.ok, data };
  } catch {
    return { ok: false, data: {} };
  }
}

function mergeEmails(...lists) {
  return [...new Set(lists.flat().map((e) => cleanEmail(e)).filter(Boolean))].sort();
}

async function upsertEmail(env, email, off, newsId) {
  const id = packId(newsId, env);
  await rememberNews(env, id);
  const remote = await rpcDropPut(env, id, email, off);
  if (!remote.ok) {
    const msg = String(remote.data?.message || remote.data?.msg || remote.data?.error || "");
    if (/list full/i.test(msg)) return { ok: false, status: 429, data: { error: "List full." } };
    if (/could not find|does not exist|schema cache/i.test(msg)) {
      return { ok: false, status: 503, data: { error: "Notify inbox is not ready." } };
    }
    return { ok: false, status: 503, data: { error: "Notify inbox failed." } };
  }
  const pack = await loadPack(env, id);
  const cur = new Set(Array.isArray(pack.emails) ? pack.emails : []);
  if (off) cur.delete(email);
  else cur.add(email);
  await savePack(env, { ...pack, emails: [...cur] }, id);
  return { ok: true, status: 200, data: { n: Number(remote.data && remote.data.n) || cur.size } };
}

async function smtpSend(env, { recipients, subject, text, html, selfOnly, toEmail }) {
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
      `To: ${toEmail || `THE WEARS ON <${user}>`}`,
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
  if (fallback === "snkrs" && /snkrs|nike/.test(s)) return "snkrs";
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

function overlayStores(base, list, extra) {
  const overlay = {};
  const byUrl = {};
  for (const s of normalizeStores(list)) {
    overlay[s.id] = s;
    byUrl[s.url.replace(/\/+$/, "")] = s;
  }
  const out = [];
  const seen = new Set();
  for (const b of base) {
    const u = hrefAbs(b.url).replace(/\/+$/, "");
    const hit = overlay[b.id] || (b.id === "snkrs" ? overlay.nike : null) || byUrl[u] || {};
    out.push({ id: b.id, label: hit.label || b.label, url: hit.url || b.url });
    seen.add(b.id);
  }
  if (!extra) return out;
  for (const s of normalizeStores(list)) {
    if (seen.has(s.id)) continue;
    const u = s.url.replace(/\/+$/, "");
    if (out.some((x) => x.url.replace(/\/+$/, "") === u)) continue;
    out.push(s);
    seen.add(s.id);
  }
  return out;
}

async function fetchNewsRows(env, ids) {
  const unique = [...new Set((ids || []).map((id) => String(id || "").toLowerCase()).filter(Boolean))];
  if (!unique.length) return [];
  const sb = String(env.SUPABASE_URL || env.WEARS_SUPABASE_URL || SB_URL).replace(/\/$/, "");
  const key = env.SUPABASE_ANON_KEY || env.WEARS_SUPABASE_ANON_KEY || SB_KEY;
  try {
    const res = await fetch(`${sb}/rest/v1/drip_news?id=in.(${unique.join(",")})&select=id,title,product_name,buy_note,buy_url`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    const rows = await res.json().catch(() => []);
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}

async function loadLiveDrop(env, newsId) {
  const requested = cleanNewsId(newsId, env);
  const id = packId(requested, env);
  const af1 = id === AF1_NEWS_ID;
  const fallback = af1 ? {
    newsId: requested,
    at: AF1_AT,
    title: "GTA 6 × TRAVIS SCOTT - ONLY 600 PAIRS OF THE MULTICOLOR AF1",
    when: formatWhen(AF1_AT),
    stores: normalizeStores(AF1_STORES),
    on: true,
  } : {
    newsId: requested,
    at: env.VICE_AT || "2026-11-20T15:00:00Z",
    title: "MIAMI HEAT × CACTUS JACK × NIKE × GTA VI",
    when: "20 NOV 2026 · 10:00 AM ET",
    stores: normalizeStores(VICE_STORES),
    on: true,
  };
  const rows = await fetchNewsRows(env, af1 ? AF1_NEWS_IDS : [requested]);
  if (!rows.length) return fallback;
  const requestedRow = rows.find((r) => String(r.id).toLowerCase() === requested)
    || rows.find((r) => String(r.id).toLowerCase() === id)
    || rows[0];
  if (af1) {
    let stores = normalizeStores(AF1_STORES);
    let at = AF1_AT;
    let on = false;
    const ordered = [...rows.filter((r) => r !== requestedRow), requestedRow];
    for (const row of ordered) {
      const packed = parseDropNote(row.buy_note);
      if (!packed.off) on = true;
      if (packed.at) at = packed.at;
      stores = overlayStores(stores, packed.stores, false);
    }
    return {
      newsId: requested,
      at,
      title: String(requestedRow.title || requestedRow.product_name || fallback.title),
      when: formatWhen(at),
      stores,
      on,
    };
  }
  const packed = parseDropNote(requestedRow.buy_note);
  const listed = packed.stores.length ? packed.stores : [];
  const stores = requested === VICE_NEWS_ID
    ? overlayStores(VICE_STORES, listed, true)
    : (normalizeStores(listed).length ? normalizeStores(listed) : fallback.stores);
  return {
    newsId: requested,
    at: String(packed.at || fallback.at),
    title: String(requestedRow.product_name || requestedRow.title || fallback.title),
    when: formatWhen(packed.at || fallback.at),
    stores,
    on: !packed.off,
  };
}

function dropMailSubject(stores) {
  const one = Array.isArray(stores) && stores.length === 1 ? stores[0].label : "";
  return one ? `DROP LOCK OPENED — ${String(one).toUpperCase()}` : "DROP LOCK OPENED — THE WEARS ON";
}

function dropPathSlug(title, newsId) {
  const raw = String(title || "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const slug = raw.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
  return slug || String(newsId || "dispatch");
}

function dropMailText(wave) {
  const newsId = wave.newsId || "8cbc034c-8bee-4f9f-a7c9-9b32672e1e65";
  const stores = Array.isArray(wave.stores) ? wave.stores : [];
  const page = `https://thewearson.com/#/n/${dropPathSlug(wave.title, newsId)}`;
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
    page,
  ].join("\n");
}

function dropMailHtml(wave) {
  const newsId = wave.newsId || "8cbc034c-8bee-4f9f-a7c9-9b32672e1e65";
  const page = "https://thewearson.com/#/n/" + dropPathSlug(wave.title, newsId);
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
  const newsId = cleanNewsId(body.newsId, env);
  const out = await upsertEmail(env, email, body.off === true, newsId);
  if (!out.ok) return corsJson(request, out.status, out.data);
  return corsJson(request, 200, { ok: true, on: body.off !== true, newsId, n: Number(out.data && out.data.n) || 0 });
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

async function sendWave(env, pack, emails, wave, sentStoreIds, newsId) {
  const id = packId(newsId || wave.newsId, env);
  const stores = Array.isArray(wave.stores) ? wave.stores : [];
  if (!stores.length) return { error: "No stores on card.", newsId: id };
  if (!emails.length) {
    return { sent: 0, done: true, empty: true, storeIds: wave.storeIds || [], sentStoreIds, newsId: id };
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
    }, id);
    return { sent: 0, done: true, storeIds: wave.storeIds || [], sentStoreIds: nextSent, total: emails.length, newsId: id };
  }
  const subject = dropMailSubject(stores);
  const text = dropMailText(wave);
  const html = dropMailHtml(wave);
  const hook = await readSecret(env.DROP_MAIL_HOOK);
  if (hook) {
    const res = await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fire: true, emails: batch, html, text, subject, storeIds: wave.storeIds || [], newsId: id }),
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
  }, id);
  return {
    sent: batch.length,
    cursor: next,
    done,
    total: emails.length,
    storeIds: wave.storeIds || [],
    sentStoreIds: nextSent,
    early: !!wave.early,
    newsId: id,
  };
}

async function sendOneDropMail(env, newsId, opt = {}) {
  const requested = cleanNewsId(newsId, env);
  const id = packId(requested, env);
  if (opt.batch) {
    const emails = mergeEmails(opt.emails);
    const live = await loadLiveDrop(env, requested);
    const studioIds = (Array.isArray(opt.storeIds) ? opt.storeIds : []).map((s) => String(s || "").trim()).filter(Boolean);
    const want = new Set(studioIds);
    const stores = (live.stores || []).filter((s) => want.has(s.id) && s.url);
    if (!stores.length) return { error: "No matching live store URLs. Save the dispatch first.", newsId: id };
    if (!emails.length) {
      return { sent: 0, empty: true, done: true, cursor: Number(opt.cursor || 0), total: Number(opt.total || 0), newsId: id };
    }
    const wave = {
      stores,
      storeIds: stores.map((s) => s.id),
      title: live.title,
      when: live.when,
      newsId: live.newsId,
      cursor: 0,
      done: false,
      early: true,
    };
    const subject = dropMailSubject(stores);
    const text = dropMailText(wave);
    const html = dropMailHtml(wave);
    const hook = await readSecret(env.DROP_MAIL_HOOK);
    if (hook) {
      const res = await fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fire: true, emails, html, text, subject, storeIds: wave.storeIds, newsId: id }),
      });
      if (!res.ok) throw new Error(`mail hook ${res.status}`);
    } else {
      await smtpSend(env, { recipients: emails, subject, text, html });
    }
    return {
      sent: emails.length,
      cursor: Number(opt.cursor || emails.length),
      total: Number(opt.total || 0),
      done: opt.done === true,
      storeIds: wave.storeIds,
      newsId: id,
      early: true,
    };
  }
  const pack = await loadPack(env, id);
  const emails = mergeEmails(pack.emails, opt.emails);
  const sentStoreIds = [...new Set((pack.sentStoreIds || []).map(String))];
  let wave = pack.wave && typeof pack.wave === "object" ? pack.wave : null;
  const studioIds = (opt.studio && Array.isArray(opt.storeIds) ? opt.storeIds : [])
    .map((s) => String(s || "").trim())
    .filter(Boolean);

  if (wave && !wave.done && Array.isArray(wave.stores) && wave.stores.length) {
    if (studioIds.length && waveKey(studioIds, true) !== wave.key) {
      return { busy: true, newsId: id, wave: { key: wave.key, storeIds: wave.storeIds, cursor: wave.cursor, done: false } };
    }
    return sendWave(env, pack, emails, wave, sentStoreIds, id);
  }

  const live = await loadLiveDrop(env, requested);

  if (studioIds.length) {
    const want = new Set(studioIds);
    const stores = (live.stores || []).filter((s) => want.has(s.id) && s.url);
    if (!stores.length) return { error: "No matching live store URLs. Save the dispatch first.", newsId: id };
    const ids = stores.map((s) => s.id);
    if (!opt.again && ids.every((sid) => sentStoreIds.includes(sid))) {
      return { already: true, sentStoreIds, storeIds: ids, newsId: id };
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
    return sendWave(env, pack, emails, wave, sentStoreIds, id);
  }

  const at = Date.parse(live.at);
  if (!Number.isFinite(at) || (Date.now() < at && !opt.force)) return { skipped: true, newsId: id };
  if (!live.on) return { skipped: true, off: true, newsId: id };
  const stores = (live.stores || []).filter((s) => s.url && !sentStoreIds.includes(s.id));
  if (!stores.length) return { already: true, done: true, sentStoreIds, newsId: id };
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
  return sendWave(env, pack, emails, wave, sentStoreIds, id);
}

export async function sendDueDropMail(env, opt = {}) {
  if (opt.newsId || opt.studio) {
    if (opt.studio && !opt.newsId) return { error: "newsId required." };
    return sendOneDropMail(env, opt.newsId, opt);
  }
  const idx = await loadIndex(env);
  let last = { skipped: true };
  for (const id of idx.ids) {
    const out = await sendOneDropMail(env, id, opt);
    last = { ...out, newsId: id };
    if (out.sent > 0 || out.busy || (out.done === false && Number(out.cursor || 0) > 0)) return last;
  }
  return last;
}

export async function dropTickResponse(request, env) {
  if (request.method === "OPTIONS") return preflight(request);
  if (request.method !== "POST") return corsJson(request, 405, { error: "POST only." });
  let body = {};
  try { body = await request.json(); } catch { body = {}; }
  try {
    const newsId = body.newsId ? cleanNewsId(body.newsId, env) : "";
    const out = await sendDueDropMail(env, { live: body.live === true, newsId: newsId || undefined });
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
  const url = new URL(request.url);
  if (request.method === "GET") {
    const newsId = packId(url.searchParams.get("newsId") || env.VICE_NEWS_ID, env);
    const pack = await loadPack(env, newsId);
    const emails = [...new Set((pack.emails || []).map((e) => String(e || "").trim().toLowerCase()).filter(Boolean))].sort();
    return corsJson(request, 200, {
      ok: true,
      newsId,
      n: emails.length,
      emails,
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
  const newsId = packId(body.newsId || url.searchParams.get("newsId"), env);
  const storeIds = Array.isArray(body.storeIds)
    ? body.storeIds.map((s) => String(s || "").trim()).filter(Boolean).slice(0, 6)
    : [];
  if (!storeIds.length) return corsJson(request, 400, { error: "storeIds required." });
  try {
    const extra = Array.isArray(body.emails) ? body.emails : [];
    const out = await sendDueDropMail(env, {
      studio: true,
      storeIds,
      again: body.again === true,
      newsId,
      emails: extra,
      batch: body.batch === true,
      cursor: body.cursor,
      total: body.total,
      done: body.done === true,
    });
    const status = out.error ? 400 : 200;
    return corsJson(request, status, { ok: !out.error, ...out });
  } catch (err) {
    return corsJson(request, 500, { error: String(err && err.message || err) });
  }
}

function hookSecretBytes(raw) {
  let s = String(raw || "").trim();
  if (s.includes(",")) s = s.slice(s.indexOf(",") + 1);
  s = s.replace(/^whsec_/i, "");
  try {
    return Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  } catch {
    return new TextEncoder().encode(s);
  }
}

function b64Bytes(s) {
  try {
    return Uint8Array.from(atob(String(s || "").trim()), (c) => c.charCodeAt(0));
  } catch {
    return new Uint8Array();
  }
}

function sameBytes(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a[i] ^ b[i];
  return out === 0;
}

async function verifySendEmailHook(raw, request, env) {
  const secret = (await readSecret(env.SEND_EMAIL_HOOK_SECRET)) || (await readSecret(env.AUTH_HOOK_SECRET));
  if (!secret) return { ok: false, status: 503, error: "SEND_EMAIL_HOOK_SECRET missing." };
  const id = request.headers.get("webhook-id") || "";
  const ts = request.headers.get("webhook-timestamp") || "";
  const sigHeader = request.headers.get("webhook-signature") || "";
  if (!id || !ts || !sigHeader) return { ok: false, status: 401, error: "Missing webhook signature." };
  const age = Math.abs(Date.now() / 1000 - Number(ts));
  if (!Number.isFinite(Number(ts)) || age > 300) return { ok: false, status: 401, error: "Stale webhook." };
  const key = await crypto.subtle.importKey(
    "raw",
    hookSecretBytes(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const mac = new Uint8Array(await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${id}.${ts}.${raw}`)
  ));
  const sigs = String(sigHeader).split(/\s+/).map((part) => {
    const bit = part.trim();
    const i = bit.indexOf(",");
    return i >= 0 ? bit.slice(i + 1) : bit;
  }).filter(Boolean);
  if (!sigs.some((s) => sameBytes(b64Bytes(s), mac))) return { ok: false, status: 401, error: "Bad webhook signature." };
  return { ok: true };
}

function authMailCopy(type) {
  const t = String(type || "signup").toLowerCase();
  if (t === "recovery") return { kicker: "RESET", title: "PASSWORD<br>CODE", subject: "RESET CODE — THE WEARS ON" };
  if (t.includes("email_change")) return { kicker: "EMAIL", title: "CONFIRM<br>EMAIL", subject: "CONFIRM EMAIL — THE WEARS ON" };
  if (t === "magiclink") return { kicker: "SIGN IN", title: "SIGN IN<br>CODE", subject: "SIGN IN CODE — THE WEARS ON" };
  return { kicker: "MEMBER", title: "VERIFY<br>CODE", subject: "VERIFY CODE — THE WEARS ON" };
}

function authMailHtml({ code, extra, type, email }) {
  const copy = authMailCopy(type);
  const face = "'Inter Tight', Inter, Helvetica, Arial, sans-serif";
  const digits = String(code || "").replace(/\s+/g, "");
  const second = String(extra || "").replace(/\s+/g, "");
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${copy.subject}</title>
</head>
<body style="margin:0;padding:0;background:#e8e8e8">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#e8e8e8">
    <tr>
      <td align="center" style="padding:28px 12px">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:560px;max-width:100%;background:#f5f5f5;border:1.5px solid #000000">
          <tr>
            <td style="padding:10px 14px;border-bottom:1.5px solid #000000">
              <p style="margin:0;font-family:${face};font-size:11px;font-weight:900;letter-spacing:2.4px;color:#000000">THE VERIFY CARD</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:36px 22px 28px">
              <span style="display:inline-block;padding:6px 10px;border:1.5px solid #000000;background:#000000;color:#ffffff;font-family:${face};font-size:8px;font-weight:900;letter-spacing:1.5px;line-height:1">${copy.kicker}</span>
              <h1 style="margin:18px 0 0;font-family:${face};font-size:48px;line-height:0.92;font-weight:900;letter-spacing:1.2px;text-transform:uppercase;color:#000000">${copy.title}</h1>
              <p style="margin:14px 0 0;font-family:${face};font-size:10px;font-weight:900;letter-spacing:1.8px;line-height:1.4;text-transform:uppercase;color:#000000">${escHtml(email)}</p>
            </td>
          </tr>
          <tr>
            <td style="border-top:1.5px solid #000000;padding:28px 18px;text-align:center">
              <p style="margin:0;font-family:${face};font-size:9px;font-weight:900;letter-spacing:2.2px;color:#000000">YOUR CODE</p>
              <p style="margin:14px 0 0;font-family:${face};font-size:52px;line-height:1;font-weight:900;letter-spacing:8px;color:#000000">${escHtml(digits)}</p>
              ${second ? `<p style="margin:18px 0 0;font-family:${face};font-size:9px;font-weight:900;letter-spacing:2.2px;color:#000000">NEW EMAIL CODE</p><p style="margin:12px 0 0;font-family:${face};font-size:36px;line-height:1;font-weight:900;letter-spacing:8px;color:#000000">${escHtml(second)}</p>` : ""}
            </td>
          </tr>
          <tr>
            <td style="border-top:1.5px solid #000000;padding:16px 18px 18px">
              <p style="margin:0;font-family:Inter, ${face};font-size:10px;font-weight:900;letter-spacing:0.6px;line-height:1.55;text-transform:uppercase;color:#000000">Enter this code in THE WEARS ON. It expires. If you did not ask for it, ignore this mail.</p>
            </td>
          </tr>
          <tr>
            <td style="border-top:1.5px solid #000000;padding:12px 18px">
              <p style="margin:0;font-family:${face};font-size:9px;font-weight:900;letter-spacing:2px;color:#000000">THE WEARS ON</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function authMailResponse(request, env) {
  if (request.method === "OPTIONS") return preflight(request);
  if (request.method === "GET") return corsJson(request, 200, { ok: true, hook: "send-email" });
  if (request.method !== "POST") return corsJson(request, 405, { error: "POST." });
  const raw = await request.text();
  const verified = await verifySendEmailHook(raw, request, env);
  if (!verified.ok) {
    return new Response(JSON.stringify({ error: { message: verified.error } }), {
      status: verified.status,
      headers: { "Content-Type": "application/json" },
    });
  }
  let body = {};
  try { body = JSON.parse(raw || "{}"); } catch {
    return new Response(JSON.stringify({ error: { message: "Bad JSON." } }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const email = String(body.user && body.user.email || "").trim().toLowerCase();
  const data = body.email_data || {};
  const type = String(data.email_action_type || "signup");
  const token = String(data.token || "").trim();
  const tokenNew = String(data.token_new || "").trim();
  if (!email.includes("@") || !token) {
    return new Response(JSON.stringify({ error: { message: "Missing email or token." } }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const copy = authMailCopy(type);
  const text = tokenNew
    ? `${copy.subject}\n\n${token}\n\nNEW EMAIL CODE\n${tokenNew}\n`
    : `${copy.subject}\n\n${token}\n`;
  try {
    await smtpSend(env, {
      recipients: [email],
      toEmail: email,
      subject: copy.subject,
      text,
      html: authMailHtml({ code: token, extra: tokenNew, type, email }),
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: { http_code: 500, message: String(err && err.message || err) } }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(JSON.stringify({}), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
