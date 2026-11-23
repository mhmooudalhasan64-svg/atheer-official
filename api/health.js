export default {
  async fetch(request) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return Response.json(
        { ok: false, error: "method_not_allowed" },
        { status: 405, headers: { Allow: "GET, HEAD", "Cache-Control": "no-store" } }
      );
    }

    const payload = {
      ok: true,
      service: "atheer-dev-team-api",
      version: 1,
      integrations: {
        chatgpt: false,
        gemini: false,
        github: false
      },
      taskStorage: "not_configured",
      timestamp: new Date().toISOString()
    };

    return Response.json(payload, {
      status: 200,
      headers: { "Cache-Control": "no-store, max-age=0" }
    });
  }
};
