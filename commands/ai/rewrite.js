const { askAI, checkAILimit } = require("../../lib/aiHelper");

module.exports = {
    name: "rewrite",
    aliases: ["polish", "improve"],
    description: "Rewrite text to make it clearer and more natural.",
    category: "ai",
    async execute({ sock, jid, args, msg, sender }) {
        const input = args.join(" ").trim();
        if (!input) {
            return sock.sendMessage(jid, {
                text: "✍️ *Usage:* `.rewrite <text>`\n\nExample: `.rewrite make this email more professional`"
            }, { quoted: msg });
        }
        const limit = checkAILimit(sender || jid);
        if (!limit.allowed) return sock.sendMessage(jid, { text: limit.reason }, { quoted: msg });
        try {
            await sock.sendMessage(jid, { react: { text: "✍️", key: msg.key } });
            const result = await askAI(input,
                "Rewrite the user's text for clarity, grammar, and natural tone. Preserve the meaning. Return only the rewritten text, with no preamble.");
            return sock.sendMessage(jid, { text: `✍️ *REWRITTEN TEXT*\n\n${result}` }, { quoted: msg });
        } catch (error) {
            console.error("Rewrite error:", error.message);
            return sock.sendMessage(jid, { text: "⚠️ Rewrite AI is unavailable right now. Try again later." }, { quoted: msg });
        }
    }
};
