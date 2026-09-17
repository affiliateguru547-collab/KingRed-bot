const { askAI, checkAILimit } = require("../../lib/aiHelper");

module.exports = {
    name: "chat",
    aliases: ["talk", "convo"],
    description: "Have a casual conversation with Kingred AI.",
    category: "ai",
    execute: async ({ sock, jid, args, msg, sender }) => {
        const text = args.join(" ").trim();
        if (!text) {
            return await sock.sendMessage(jid, {
                text: "💬 *Usage:* `.chat <message>`\n\n_Example: `.chat How is your day?`_"
            });
        }

        try {
            const limit = checkAILimit(sender || jid);
            if (!limit.allowed) return await sock.sendMessage(jid, { text: limit.reason }, { quoted: msg });
            await sock.sendMessage(jid, { react: { text: "💬", key: msg.key } });

            const system =
                "You are Kingred, a witty and friendly WhatsApp chatbot. " +
                "Keep responses conversational, warm, and brief (under 150 words). " +
                "Use emojis occasionally to match the WhatsApp vibe.";

            const reply = await askAI(text, system);

            await sock.sendMessage(jid, {
                text: `💬 *KINGRED CHAT*\n\n${reply}`
            }, { quoted: msg });

        } catch (err) {
            console.error("Chat error:", err);
            await sock.sendMessage(jid, { text: "⚠️ Chat AI is unavailable right now. Try again later." });
        }
    }
};
