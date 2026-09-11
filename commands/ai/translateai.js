const { askAI, checkAILimit } = require("../../lib/aiHelper");

module.exports = {
    name: "translateai",
    aliases: ["aitranslate", "transai"],
    description: "Translate text using AI while preserving tone.",
    category: "ai",
    async execute({ sock, jid, args, msg, sender }) {
        const raw = args.join(" ").trim();
        const separator = raw.indexOf("|");
        if (separator < 1 || separator === raw.length - 1) {
            return sock.sendMessage(jid, {
                text: "🌍 *Usage:* `.translateai <language> | <text>`\n\nExample: `.translateai French | Good morning, how are you?`"
            }, { quoted: msg });
        }
        const language = raw.slice(0, separator).trim();
        const input = raw.slice(separator + 1).trim();
        const limit = checkAILimit(sender || jid);
        if (!limit.allowed) return sock.sendMessage(jid, { text: limit.reason }, { quoted: msg });
        try {
            await sock.sendMessage(jid, { react: { text: "🌍", key: msg.key } });
            const result = await askAI(`Translate this text into ${language}:\n\n${input}`,
                "You are a professional translator. Preserve meaning, formatting, names, and tone. Return only the translation, with no commentary.");
            return sock.sendMessage(jid, { text: `🌍 *TRANSLATION — ${language.toUpperCase()}*\n\n${result}` }, { quoted: msg });
        } catch (error) {
            console.error("AI translation error:", error.message);
            return sock.sendMessage(jid, { text: "⚠️ Translation AI is unavailable right now. Try again later." }, { quoted: msg });
        }
    }
};
