const test = require("node:test");
const assert = require("node:assert/strict");

const community = require("../commands/general/community");

test("community command exposes the Kingred channel and group links", async () => {
    let sent;
    const sock = {
        sendMessage: async (...args) => {
            sent = args;
            return { key: { id: "test" } };
        }
    };
    await community.execute({ sock, jid: "123@s.whatsapp.net", msg: {} });
    assert.equal(community.name, "community");
    assert.ok(community.aliases.includes("followchannel"));
    assert.ok(community.aliases.includes("joingroup"));
    assert.match(sent[1].text, /https:\/\/whatsapp\.com\/channel\/00029Vb9AwScF6sn47ClubG1Z/);
    assert.match(sent[1].text, /https:\/\/chat\.whatsapp\.com\/0029Vb9AwScF6sn47ClubG1Z/);
    assert.match(sent[1].text, /optional/i);
});
