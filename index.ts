import { Elysia } from "elysia";
import { ProxyAgent } from "undici";

const UPSTREAM = "https://api.open-meteo.com/v1/forecast";

/* Если сервер в РФ и Open-Meteo (Hetzner) недоступен напрямую */
const PROXY_URL = process.env.OPEN_METEO_PROXY;

type ProxyHandler = (url: string) => Promise<Response>;

let proxyFetch: ProxyHandler;

if (!PROXY_URL) {
  proxyFetch = (url) =>
    fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(15_000),
    });
} else if (PROXY_URL.startsWith("socks")) {
  // SOCKS4/SOCKS5 — используем node:https + SocksProxyAgent
  const { SocksProxyAgent } = await import("socks-proxy-agent");
  const { request } = await import("node:https");
  const agent = new SocksProxyAgent(PROXY_URL);

  proxyFetch = (url) =>
    new Promise<Response>((resolve, reject) => {
      const req = request(
        url,
        {
          agent,
          headers: { Accept: "application/json" },
          timeout: 15_000,
          method: "GET",
        },
        (res) => {
          const chunks: Buffer[] = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () => {
            const body = Buffer.concat(chunks).toString();
            resolve(
              new Response(body, {
                status: res.statusCode,
                headers: Object.fromEntries(
                  Object.entries(res.headers).map(([k, v]) => [
                    k,
                    Array.isArray(v) ? v.join(", ") : v ?? "",
                  ]),
                ),
              }),
            );
          });
        },
      );
      req.on("timeout", () => req.destroy(new Error("Request timed out")));
      req.on("error", reject);
      req.end();
    });
} else {
  // HTTP/HTTPS CONNECT-прокси — нативный fetch + undici.ProxyAgent
  const agent = new ProxyAgent(PROXY_URL);
  proxyFetch = (url) =>
    fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(15_000),
      dispatcher: agent as any,
    });
}

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

    try {
      const res = await proxyFetch(`${UPSTREAM}?${params}`);

      if (!res.ok) {
        set.status = res.status as 400;
        return { error: `Open-Meteo ответил ${res.status}` };
      }

      const data = await res.json();

      set.headers["Cache-Control"] = "public, s-maxage=1800, stale-while-revalidate=3600";
      return data;
    } catch (err) {
      console.error("Upstream error:", err);
      set.status = 502;
      return { error: "Open-Meteo unavailable" };
    }
  })
  .listen(process.env.PORT ?? 3001);

console.log(`open-meteo-proxy running on port ${app.server?.port}`);
