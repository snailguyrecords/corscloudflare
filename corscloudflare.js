export default {
  async fetch(request) {
    // Allow only GET requests
    if (request.method !== "GET") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const url = new URL(request.url);
    const targetUrl = url.searchParams.get("url");

    if (!targetUrl) {
      return new Response(
        JSON.stringify({ error: "Missing ?url= parameter" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const odesliEndpoint =
      "https://api.song.link/v1-alpha.1/links?url=" +
      encodeURIComponent(targetUrl);

    try {
      const res = await fetch(odesliEndpoint, {
        headers: {
          "User-Agent": "Odesli-CORS-Proxy",
        },
      });

      return new Response(res.body, {
        status: res.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
          "Cache-Control": "public, max-age=3600",
        },
      });
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch Odesli" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
  },
};
