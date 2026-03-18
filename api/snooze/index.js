const POWER_AUTOMATE_URL = "https://defaultee6eeac0ac6d4aceaadf634159dc6f.88.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/1ac647e24dd04111b7688246d2c5bcd4/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=0TOmUrf55h56qrszM-0PhUMIDnp2ZWokvaPK9l217Ek";
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
