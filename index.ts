import { Elysia } from "elysia";
import { ProxyAgent } from "undici";

const UPSTREAM = "https://api.open-meteo.com/v1/forecast";

/* Если сервер в РФ и Open-Meteo (Hetzner) недоступен напрямую */
const PROXY_URL = process.env.OPEN_METEO_PROXY;
const PROXY_AGENT = PROXY_URL ? new ProxyAgent(PROXY_URL) : undefined;

const app = new Elysia()
  .get("/forecast", async ({ query, set }) => {
    if (!query.latitude || !query.longitude) {
      set.status = 400;
      return { error: "latitude and longitude required" };
    }

    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value) params.set(key, String(value));
    }

    const upstreamUrl = `${UPSTREAM}?${params}`;

    try {
      const opts: RequestInit & { dispatcher?: ProxyAgent } = {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(15_000),
      };
      if (PROXY_AGENT) opts.dispatcher = PROXY_AGENT;

      const res = await fetch(upstreamUrl, opts);

      if (!res.ok) {
        set.status = res.status as 400;
        return { error: `Open-Meteo ответил ${res.status}` };
      }

      const data = await res.json();

      set.headers["Cache-Control"] = "public, s-maxage=1800, stale-while-revalidate=3600";
      return data;
    } catch {
      set.status = 502;
      return { error: "Open-Meteo unavailable" };
    }
  })
  .listen(process.env.PORT ?? 3001);

console.log(`open-meteo-proxy running on port ${app.server?.port}`);
