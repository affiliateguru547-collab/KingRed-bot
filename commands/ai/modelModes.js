const { askGroq, checkAILimit } = require("../../lib/aiHelper");

const MODES = {
    gpt56sol: {
        name: "gpt56sol",
        aliases: ["gpt5sol", "sol"],
        title: "SOL CODING MODE",
        icon: "🧠",
        description: "High-quality coding and reasoning mode.",
        system: "You are Firebox Sol Mode, a high-quality coding and reasoning assistant. Give accurate, structured, practical answers. For code, include concise explanations and safe implementation details. Do not claim to be GPT-5.6 or any other proprietary model; you are a Firebox AI mode."
    },
    claudeopus47: {
        name: "claudeopus47",
        aliases: ["claude", "opus47", "opus"],
        title: "OPUS ENGINEERING MODE",
        icon: "🛠️",
        description: "Careful software-engineering and analysis mode.",
        system: "You are Firebox Opus Engineering Mode, a careful and thorough software-engineering assistant. Think through edge cases, security, maintainability, and testing. Do not claim to be Claude Opus 4.7; you are a Firebox AI mode."
    },
    gemini38flash: {
        name: "gemini38flash",
        aliases: ["gemini", "flash38", "flash"],
        title: "FLASH MULTIMEDIA MODE",
        icon: "⚡",
        description: "Fast, concise answers for everyday tasks.",
        system: "You are Firebox Flash Mode, a fast and concise assistant for everyday tasks, summaries, brainstorming, and explanations. Keep answers useful and direct. Do not claim to be Gemini 3.8 Flash; you are a Firebox AI mode."
    }
};

function createMode(mode) {
    return {
        name: mode.name,
        aliases: mode.aliases,
        description: `${mode.description} Powered by Firebox AI.`,
        category: "ai",
        async execute({ sock, jid, args, msg, sender }) {
            const prompt = args.join(" ").trim();
            if (!prompt) {
                return sock.sendMessage(jid, {
                    text: `${mode.icon} *${mode.title}*\n\nUsage: ".${mode.name} <your prompt>"\n\n${mode.description}\n_Powered by Firebox AI • Firebox Bot._`
                }, { quoted: msg });
            }

            const limit = checkAILimit(sender || jid);
            if (!limit.allowed) return sock.sendMessage(jid, { text: limit.reason }, { quoted: msg });

            try {
                await sock.sendMessage(jid, { react: { text: mode.icon, key: msg.key } });
                const answer = await askGroq(prompt, mode.system);
                return sock.sendMessage(jid, {
                    text: `${mode.icon} *${mode.title}*\n\n${answer}\n\n_Powered by Firebox AI • Firebox Bot_`
                }, { quoted: msg });
            } catch (error) {
                console.error(`${mode.name} error:`, error.message || error);
                return sock.sendMessage(jid, {
                    text: "⚠️ This Firebox AI mode is temporarily unavailable. Please try again later."
                }, { quoted: msg });
            }
        }
    };
}

module.exports = Object.fromEntries(Object.entries(MODES).map(([key, mode]) => [key, createMode(mode)]));
