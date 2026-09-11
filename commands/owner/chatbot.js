const { getSettings, updateSettings } = require("../../lib/settings");

module.exports = {
    name: "chatbot",
    aliases: ["aichatbot", "ai-reply"],
    description: "Toggle automatic Firebox AI replies in private messages or all chats",
    category: "owner",
    isOwnerOnly: true,
    execute: async ({ sock, jid, args, msg }) => {
        const settings = getSettings();
        const action = args[0]?.toLowerCase().trim();
        const mode = args[1]?.toLowerCase().trim();

        if (!action) {
            const on = "✅ ON";
            const off = "❌ OFF";
            let help = `*🤖 CHATBOT (AI) CONFIGURATION*\n`;
            help += `━━━━━━━━━━━━━━━━━━\n\n`;
            help += `Enables AI-powered automatic replies from Firebox AI.\n\n`;
            help += `💠 *Private DMs:* ${settings.chatbotAI ? on : off}\n`;
            help += `💠 *All chats:* ${settings.chatbotAIAll ? on : off}\n\n`;
            help += `🔧 *Commands:*\n`;
            help += `▸ \`.chatbot on\` — Enable AI replies in private DMs\n`;
            help += `▸ \`.chatbot off\` — Disable AI replies\n`;
            help += `▸ \`.chatbot all on\` — Enable AI replies in DMs and groups\n`;
            help += `▸ \`.chatbot all off\` — Disable all automatic AI replies`;
            return await sock.sendMessage(jid, { text: help }, { quoted: msg });
        }

        if (action === "on" && !mode) {
            await updateSettings({ chatbotAI: true, chatbotAIAll: false });
            return await sock.sendMessage(jid, { text: "✅ *Chatbot (AI)* is now *ON*. AI will automatically reply in DMs." }, { quoted: msg });
        } else if (action === "off" && !mode) {
            await updateSettings({ chatbotAI: false, chatbotAIAll: false });
            return await sock.sendMessage(jid, { text: "❌ *Chatbot (AI)* is now *OFF*." }, { quoted: msg });
        } else if (action === "all" && mode === "on") {
            await updateSettings({ chatbotAI: true, chatbotAIAll: true });
            return await sock.sendMessage(jid, { text: "✅ *Firebox AI Chatbot* is now *ON for all chats* (DMs and groups)." }, { quoted: msg });
        } else if (action === "all" && mode === "off") {
            await updateSettings({ chatbotAI: false, chatbotAIAll: false });
            return await sock.sendMessage(jid, { text: "❌ *Firebox AI Chatbot* is now *OFF for all chats*." }, { quoted: msg });
        } else {
            return await sock.sendMessage(jid, { text: "⚠️ Use `.chatbot on`, `.chatbot off`, `.chatbot all on`, or `.chatbot all off`" }, { quoted: msg });
        }
    }
};
