const POWER_AUTOMATE_URL = "https://defaultee6eeac0ac6d4aceaadf634159dc6f.88.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/95e9f133d86a410e9764700938422d8a/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=CRdnV6Tzduut0Hvv28WVs_0Fka6HOnci2TUq1F5UJ0A";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

module.exports = async function (context, req) {
  if (req.method === "OPTIONS") {
    context.res = {
      status: 204,
      headers: CORS_HEADERS,
      body: ""
    };
    return;
  }

  try {
    const body = req.body || {};

    const {
      itemId,
      ewsId,
      restId,
      internetMessageId,
      subject,
      hours
    } = body;

    const parsedHours = Number(hours);

    const hasAnyId =
      !!itemId ||
      !!ewsId ||
      !!restId ||
      !!internetMessageId;

    if (!hasAnyId || Number.isNaN(parsedHours)) {
      context.log.warn("Invalid snooze payload received", body);

      context.res = {
        status: 400,
        headers: CORS_HEADERS,
        body: "Missing a valid email identifier or hours"
      };
      return;
    }

    const flowPayload = {
      itemId: itemId || restId || ewsId || null,
      ewsId: ewsId || null,
      restId: restId || itemId || null,
      internetMessageId: internetMessageId || null,
      subject: subject || null,
      hours: parsedHours
    };

    context.log("Forwarding snooze payload", {
      hasItemId: !!flowPayload.itemId,
      hasEwsId: !!flowPayload.ewsId,
      hasRestId: !!flowPayload.restId,
      hasInternetMessageId: !!flowPayload.internetMessageId,
      hours: flowPayload.hours,
      subject: flowPayload.subject
    });

    const response = await fetch(POWER_AUTOMATE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(flowPayload)
    });

    const responseText = await response.text().catch(() => "");

    context.res = {
      status: response.ok ? 202 : response.status,
      headers: CORS_HEADERS,
      body: response.ok
        ? "Accepted"
        : `Flow error: ${response.status}${responseText ? ` - ${responseText}` : ""}`
    };
  } catch (err) {
    context.log.error("Snooze API error", err);

    context.res = {
      status: 500,
      headers: CORS_HEADERS,
      body: err && err.message ? err.message : "Unknown server error"
    };
  }
};
