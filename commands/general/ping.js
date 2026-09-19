module.exports = {
      name: "ping",
        aliases: ["p"],
          description: "Check bot speed",
            category: "general",
              execute: async (ctx) => {
                  try {
                        const start = Date.now();
                              const sent = await ctx.sock.sendMessage(ctx.jid, { text: "Testing speed..." });
                                    const end = Date.now();
                                          await ctx.sock.sendMessage(ctx.jid, {
                                                  text: `🔥 Kingred Pong! Speed: ${end - start}ms`,
                                                          edit: sent.key
                                                                });
                                                                    } catch (e) {
                                                                          // If any error, show Still Under Development
                                                                                await ctx.sock.sendMessage(ctx.jid, { 
                                                                                        text: "🚧 *Still Under Development*\nIf you see any error, understand we are still building KingRed to be the most powerful bot." 
                                                                                              });
                                                                                                  }
                                                                                                    },
                                                                                                    };
}