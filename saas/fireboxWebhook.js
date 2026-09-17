const crypto = require("crypto");

const hubUrl = String(process.env.KINGRED_HUB_URL || "").replace(/\/$/, "");
const botId = process.env.KINGRED_BOT_ID;
const botKey = process.env.KINGRED_BOT_KEY;
const workspaceUrl = process.env.KINGRED_PUBLIC_URL || process.env.PUBLIC_URL || "";
const botName = process.env.KINGRED_BOT_NAME || botId || "Kingred Bot";

const enabled = Boolean(hubUrl && botId && botKey);
let warned = false;

async function request(path, options = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    try {
        const response = await fetch(`${hubUrl}${path}`, {
            ...options,
            signal: controller.signal,
            headers: {
                "Content-Type": "application/json",
                "X-Kingred-Bot-Id": botId,
                "X-Kingred-Bot-Key": botKey,
                ...(options.headers || {}),
            },
        });
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body.error || `Hub returned ${response.status}`);
        return body;
    } finally {
        clearTimeout(timer);
    }
}

async function register() {
    if (!enabled) {
        if (!warned && (process.env.KINGRED_HUB_URL || process.env.KINGRED_BOT_ID || process.env.KINGRED_BOT_KEY)) {
            warned = true;
            console.warn("[KingredHub] Incomplete hub configuration; expected KINGRED_HUB_URL, KINGRED_BOT_ID, and KINGRED_BOT_KEY.");
        }
        return null;
    }
    return request("/api/register", {
        method: "POST",
        body: JSON.stringify({ name: botName, workspaceUrl }),
    });
}

async function sendEvent(type, data = {}) {
    if (!enabled) return null;
    const eventId = crypto.randomUUID();
    return request(`/api/ingest/${encodeURIComponent(botId)}`, {
        method: "POST",
        headers: { "X-Kingred-Event-Id": eventId },
        body: JSON.stringify({ type, data }),
    });
}

function start() {
    if (!enabled) return;
    register()
        .then(() => sendEvent("bot.status", { status: "service_online" }))
        .catch(error => console.warn(`[KingredHub] Registration failed: ${error.message}`));
}

module.exports = { enabled, register, sendEvent, start };
