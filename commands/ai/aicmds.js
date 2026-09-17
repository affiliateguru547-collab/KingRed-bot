module.exports = {
    name: "aicmds",
    aliases: ["aicommands", "aihelp"],
    description: "Show Kingred AI commands.",
    category: "ai",
    async execute({ sock, jid, msg }) {
        const text =
            "🤖 *KINGRED AI COMMANDS*\n\n" +
            "`.ai <question>` — Ask anything\n" +
            "`.chat <message>` — Casual conversation\n" +
            "`.explain <topic>` — Simple explanation\n" +
            "`.code <task>` — Generate code\n" +
            "`.rewrite <text>` — Improve wording\n" +
            "`.translateai <language> | <text>` — Translate text\n" +
            "`.gpt56sol <prompt>` — High-quality coding/reasoning mode\n" +
            "`.claudeopus47 <prompt>` — Careful engineering mode\n" +
            "`.gemini38flash <prompt>` — Fast everyday assistant mode\n" +
            "`.summarize` — Summarize the latest group discussion\n" +
            "`.imagine <description>` — Generate an image\n\n" +
            "_These are Firebox AI modes. AI requests share a per-user hourly and daily limit._";
        return sock.sendMessage(jid, { text }, { quoted: msg });
    }
};
