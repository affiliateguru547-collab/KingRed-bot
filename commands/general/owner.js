const { ownerNumbers } = require("../../config");

module.exports = {
    name: "owner",
    aliases: ["creator", "master", "boss"],
    description: "Displays the Bot Owner's contact information.",
    category: "general",
    async execute({ sock, jid, msg }) {
        try {
            const primaryOwner = ownerNumbers[0].split("@")[0];
            const vcard = 'BEGIN:VCARD\n' // metadata of the contact card
                + 'VERSION:3.0\n' 
                + 'FN: Denzel\n' // full name
                + 'ORG:Kingred Studios;\n' // the organization of the contact
                + `TEL;type=CELL;type=VOICE;waid=${primaryOwner}:+${primaryOwner}\n` // WhatsApp ID + phone number
                + 'END:VCARD';

            await sock.sendMessage(jid, {
                contacts: {
                    displayName: "Denzel",
                    contacts: [{ vcard }]
                }
            }, { quoted: msg });

            await sock.sendMessage(jid, { 
                text: `👑 *KINGRED BOT OWNER*\n\n*Owner:* Denzel\n*Company:* Kingred Studios\n*WhatsApp:* +254100969922\n*GitHub:* https://affiliateguru.com/njogu26713-commits/firebox-bot`
            }, { quoted: msg });

        } catch (err) {
            console.error("Owner card error:", err);
            await sock.sendMessage(jid, { text: "❌ Failed to send owner contact information." });
        }
    }
};
