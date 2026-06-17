const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store",
};

const VKEY = (slug) => "v:" + slug;

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS });
    }
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    const json = (obj, status = 200) =>
      new Response(JSON.stringify(obj), {
        status,
        headers: { "Content-Type": "application/json", ...CORS },
      });

    try {
      // ---- Prompt submissions (moderation queue) ----
      if (path === "/submit" && request.method === "POST") {
        const b = await request.json().catch(() => ({}));
        const clip = (v, n) => (typeof v === "string" ? v.slice(0, n) : "");
        const entry = {
          title: clip(b.title, 200),
          category: clip(b.category, 80),
          prompt: clip(b.prompt, 8000),
          name: clip(b.name, 120),
          displayName: clip(b.displayName, 120),
          link: clip(b.link, 300),
          at: new Date().toISOString(),
        };
        if (!entry.title || !entry.prompt) return json({ error: "title and prompt required" }, 400);
        const id = "sub:" + Date.now() + ":" + Math.random().toString(36).slice(2, 8);
        await env.VOTES.put(id, JSON.stringify(entry));
        return json({ ok: true });
      }
      if (path === "/submissions" && request.method === "GET") {
        const list = await env.VOTES.list({ prefix: "sub:" });
        const out = [];
        for (const k of list.keys) {
          const v = await env.VOTES.get(k.name);
          if (v) out.push({ id: k.name, ...JSON.parse(v) });
        }
        out.sort((a, b) => (a.at < b.at ? 1 : -1));
        return json({ count: out.length, submissions: out });
      }

      // ---- Votes ----
      if (request.method === "GET") {
        const slugsParam = url.searchParams.get("slugs");
        if (slugsParam) {
          const slugs = slugsParam.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 200);
          const result = {};
          await Promise.all(
            slugs.map(async (s) => {
              result[s] = parseInt((await env.VOTES.get(VKEY(s))) || "0", 10);
            })
          );
          return json(result);
        }
        const slug = url.searchParams.get("slug");
        if (!slug) return json({ error: "slug required" }, 400);
        const count = parseInt((await env.VOTES.get(VKEY(slug))) || "0", 10);
        return json({ slug, count });
      }
      if (request.method === "POST") {
        const body = await request.json().catch(() => ({}));
        const slug = typeof body.slug === "string" ? body.slug.slice(0, 120) : "";
        let delta = parseInt(body.delta, 10);
        if (delta !== 1 && delta !== -1) delta = 1;
        if (!slug) return json({ error: "slug required" }, 400);
        const cur = parseInt((await env.VOTES.get(VKEY(slug))) || "0", 10);
        const next = Math.max(0, cur + delta);
        await env.VOTES.put(VKEY(slug), String(next));
        return json({ slug, count: next });
      }

      return json({ error: "not found" }, 404);
    } catch (e) {
      return json({ error: String(e) }, 500);
    }
  },
};
