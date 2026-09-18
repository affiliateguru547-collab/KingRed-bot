// KingRed - AntiVC (auto mute group call)
module.exports = {
  name: "antivc",
  async callEvent(sock, call) {
    // when someone starts VC in group
    if (call.status === "offer") {
      let groupId = call.chatId
      // mute the group
      await sock.groupSettingUpdate(groupId, 'announcement') // closes group
      await sock.sendMessage(groupId, { text: "🔴 *KingRed AntiVC*\nVoice/Video call detected! Group muted by bot." })
      setTimeout(async () => {
        await sock.groupSettingUpdate(groupId, 'not_announcement') // open after 5 mins
      }, 300000)
    }
  }
}
