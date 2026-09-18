let handler = async (m, { conn }) => {
    let start = new Date()
    let ping = await conn.sendMessage(m.chat, { text: 'Checking...' })
    let end = new Date()
    let speed = end - start
    let text = `*👑 KINGRED BOT*\n\n⚡ Speed: ${speed}ms\n🚀 Status: Active\n👑 Owner: Denzel`
    await conn.sendMessage(m.chat, { text: text, edit: ping.key })
    }
    handler.command = ['p','ping','speed']
    module.exports = handler
}