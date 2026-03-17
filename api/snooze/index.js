const POWER_AUTOMATE_URL = "https://default2b7d62b8d08a4aefb2e47a009afac5.f9.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/9e12582178164c5b975858558a5edbd9/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=rYa-13BAYagKd1Hf0-yKeoWhnLnUD6mgVLhghvLjUo0";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

module.exports = async function (context, req) {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    context.res = { status: 204, headers: CORS_HEADERS, body: "" };
    return;
  }

  try {
    const { itemId, hours } = req.body;
    if (!itemId || !hours) {
      context.res = { status: 400, headers: CORS_HEADERS, body: "Missing itemId or hours" };
      return;
    }

    const response = await fetch(POWER_AUTOMATE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, hours })
    });

    context.res = {
      status: response.ok ? 202 : response.status,
      headers: CORS_HEADERS,
      body: response.ok ? "Accepted" : `Flow error: ${response.status}`
    };
  } catch (err) {
    context.res = { status: 500, headers: CORS_HEADERS, body: err.message };
  }
};
