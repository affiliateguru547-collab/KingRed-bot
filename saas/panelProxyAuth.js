const crypto = require("crypto");

function matchesSecret(provided, expected) {
    if (!provided || !expected) return false;
    const left = Buffer.from(String(provided));
    const right = Buffer.from(String(expected));
    return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function isPanelProxy(req) {
    return req.get("X-Kingred-Panel-Proxy") === "1" && matchesSecret(req.get("X-Kingred-Panel-Key"), process.env.KINGRED_BOT_KEY);
}

module.exports = { matchesSecret, isPanelProxy };
