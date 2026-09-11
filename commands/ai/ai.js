const { askAI, checkAILimit } = require("../../lib/aiHelper");

module.exports = {
    name: "ask",
    aliases: ["gpt", "ai", "firebox"],
    description: "Ask Firebox AI any question.",
    category: "ai",
    execute: async (ctx) => {
        const { sock, jid, args, msg, sender } = ctx;
        const query = args.join(" ").trim();

        if (!query) {
            return await sock.sendMessage(jid, {
                text:
                    "🤖 *Usage:* `.ai <question>`\n\n" +
                    "*Examples:*\n" +
                    "• `.ai Give me a React roadmap`\n" +
                    "• `.ai What is machine learning?`\n" +
                    "• `.ai Write me a motivational quote`"
            });
        }

        try {
            // 🛡️ Rate Limit Check
            const limit = checkAILimit(sender);
            if (!limit.allowed) {
                return await sock.sendMessage(jid, { text: limit.reason }, { quoted: msg });
            }

            await sock.sendMessage(jid, { react: { text: "🤖", key: msg.key } });
            await sock.sendMessage(jid, { text: "🤖 Thinking... ⏳" });

            const answer = await askAI(query);
            await sock.sendMessage(jid, {
                text: `🤖 *FIREBOX BOT AI*\n\n${answer}`
            }, { quoted: msg });

        } catch (err) {
            console.error("AI error:", err.message || err);
            await sock.sendMessage(jid, {
                text: "⚠️ *Firebox AI is unavailable right now.*\n\nCheck that `GROQ_API_KEY` is set on the bot service and redeploy Railway."
            });
        }
    }
};
