// TODO: replace with the HTTP trigger URL of the "Send Email At" Power Automate flow.
const POWER_AUTOMATE_URL = "REPLACE_WITH_SENDAT_FLOW_TRIGGER_URL";

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
      toAddress,
      sendAt,
      subject,
      body: emailBody
    } = body;

    const sendAtDate = sendAt ? new Date(sendAt) : null;
    const sendAtValid = !!sendAtDate && !Number.isNaN(sendAtDate.getTime());

    if (!toAddress || !sendAtValid) {
      context.log.warn("Invalid sendat payload received", body);

      context.res = {
        status: 400,
        headers: CORS_HEADERS,
        body: "Missing a valid recipient address or send time"
      };
      return;
    }

    const flowPayload = {
      toAddress: toAddress,
      sendAt: sendAtDate.toISOString(),
      subject: subject || "Text",
      body: emailBody || "Text"
    };

    context.log("Forwarding sendat payload", {
      hasToAddress: !!flowPayload.toAddress,
      sendAt: flowPayload.sendAt,
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
    context.log.error("Sendat API error", err);

    context.res = {
      status: 500,
      headers: CORS_HEADERS,
      body: err && err.message ? err.message : "Unknown server error"
    };
  }
};
