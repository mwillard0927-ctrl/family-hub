// Supabase Edge Function: ics-proxy
// Fetches a Google/Outlook "secret iCal" calendar link and returns it to Family Hub.
const OK = /^(calendar\.google\.com|outlook\.office365\.com|outlook\.live\.com|outlook\.office\.com|p\d+-caldav\.icloud\.com)$/;
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*", "Access-Control-Allow-Methods": "GET,OPTIONS" };
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  try {
    const url = new URL(new URL(req.url).searchParams.get("url") || "");
    if (url.protocol === "webcal:") url.protocol = "https:";
    if (url.protocol !== "https:" || !OK.test(url.hostname)) return new Response("Only Google/Outlook/iCloud calendar links are allowed", { status: 400, headers: CORS });
    const r = await fetch(url.toString(), { headers: { "User-Agent": "FamilyHub/1.0" } });
    if (!r.ok) return new Response("Calendar returned " + r.status, { status: 502, headers: CORS });
    return new Response(await r.text(), { headers: { ...CORS, "Content-Type": "text/calendar; charset=utf-8", "Cache-Control": "max-age=300" } });
  } catch (e) { return new Response("Bad link: " + e, { status: 400, headers: CORS }); }
});
