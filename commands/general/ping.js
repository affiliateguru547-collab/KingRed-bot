let handler = async (m, { conn }) => {
        let start = new Date().getTime()
            let { key } = await conn.sendMessage(m.chat, { text: '👑 KingRed checking speed...' })
                let end = new Date().getTime()
                    let speed = end - start

                        let txt = `╭─── 👑 *KINGRED BOT* ───
                        │
                        │ ⚡ *Speed:* ${speed}ms
                        │ 🚀 *Status:* Online
                        │ 👑 *Owner:* Denzel
                        │ 🏢 *Company:* Kingred Studios
                        │
                        ╰─── ⚡ *Fast & Stable* ───`

                            await conn.sendMessage(m.chat, { 
                                    text: txt,
                                            edit: key,
                                                    contextInfo: {
                                                                isForwarded: true,
                                                                            forwardedNewsletterMessageInfo: {
                                                                                            newsletterJid: "120363288443912156@newsletter",
                                                                                                            newsletterName: "Kingred Bot Updates",
                                                                                                                            serverMessageId: 1
                                                                                                                                        }
                                                                                                                                                }
                                                                                                                                                    })
                                                                                                                                                    }
                                                                                                                                                    handler.help = ['ping']
                                                                                                                                                    handler.tags = ['main']
                                                                                                                                                    handler.command = ['p', 'ping', 'speed']
                                                                                                                                                    module.exports = handler
}
