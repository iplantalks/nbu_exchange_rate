export default {
  async fetch(req, env, ctx) {
    if (req.method === "OPTIONS" && req.headers.has("origin")) {
      if (
        req.headers.get("origin").endsWith("italks.com.ua") ||
        req.headers.get("origin").endsWith("mac-blog.org.ua") ||
        req.headers.get("origin").includes("localhost")
      ) {
        return new Response(null, {
          headers: {
            "access-control-allow-origin": req.headers.get("origin"),
            "access-control-allow-methods": "*",
            "access-control-allow-headers": "*",
            "access-control-expose-headers": "*",
          },
        });
      }
      return new Response(null, { status: 403 });
    }

    var ttl = 24 * 60 * 60;
    var url = new URL(req.url);

    if (!url.pathname.startsWith("/NBUStatService/v1/statdirectory/exchange")) {
      return new Response("not found", { status: 404 });
    }

    var key = new Request(url.toString());
    var cache = caches.default;
    var response = await cache.match(key);
    if (response) {
      console.log(`cache hit for ${url}`);
      return response;
    }

    url.host = "bank.gov.ua";
    var json = await fetch(url, { cf: { cacheTtl: ttl, cacheEverything: true } }).then((r) => r.json());

    response = Response.json(json, {
      headers: {
        "access-control-allow-origin": req.headers.get("origin") || "*",
        "access-control-allow-methods": "*",
        "access-control-allow-headers": "*",
        "access-control-expose-headers": "*",
        "cache-control": `public, max-age=${ttl}`,
      },
    });

    ctx.waitUntil(cache.put(key, response.clone()));
    console.log(`cache miss for ${url}`);
    return response;
  },
};
