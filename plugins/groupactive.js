let groupActivity = {} // { groupId: { userId: messageCount } }

module.exports = {
  name: "active",
  async onMessage(m, sock) {
    if (!m.isGroup) return
    let gid = m.chat
    if (!groupActivity[gid]) groupActivity[gid] = {}
    if (!groupActivity[gid][m.sender]) groupActivity[gid][m.sender] = 0
    groupActivity[gid][m.sender]++
  },
  async execute(m, sock) {
    let gid = m.chat
    if (!groupActivity[gid]) return sock.sendMessage(gid, { text: "No activity data yet." })

    let members = (await sock.groupMetadata(gid)).participants.map(p => p.id)
    let activeList = Object.entries(groupActivity[gid]).sort((a,b)=>b[1]-a[1])

    let active = activeList.slice(0, 10).map(([id, count]) => `@${id.split('@')[0]} : ${count} msgs`).join('\n')
    let inactive = members.filter(id =>!groupActivity[gid][id]).map(id => `@${id.split('@')[0]}`).join('\n')

    await sock.sendMessage(gid, {
      text: `*KING RED GROUP ACTIVITY*\n\n*TOP ACTIVE:*\n${active}\n\n*INACTIVE (0 msgs):*\n${inactive || 'None'}`,
      mentions: members
    })
  },
  async removeInactive(m, sock) {
    let gid = m.chat
    let inactive = Object.keys(groupActivity[gid] || {}).filter(id => groupActivity[gid][id] < 2)
    for (let id of inactive) {
      await sock.groupParticipantsUpdate(gid, [id], "remove")
    }
    await sock.sendMessage(gid, { text: `Removed ${inactive.length} inactive members.` })
  }
      }
