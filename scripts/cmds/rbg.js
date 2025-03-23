const axios = require("axios");

module.exports.config = {
    name: "rbg",
    aliases: ["removebg", "backgroundremove"],
    version: "1.0",
    author: "♡︎ 𝐻𝐴𝑆𝐴𝑁 ♡︎",
    countDown: 3, 
    role: 0,
    longDescription: {
        en: "background remove your images"
    },
    category: "tools",
    guide: {
        en: "{pn} reply to an image for background remove"
    } 
};

module.exports.onStart = async ({ api, event, args }) => {
    try {
        if (!event.messageReply || !event.messageReply.attachments || !event.messageReply.attachments[0]) {
            return api.sendMessage("𝐏𝐥𝐞𝐚𝐬𝐞 𝐫𝐞𝐩𝐥𝐲 𝐭𝐨 𝐚𝐧 𝐢𝐦𝐚𝐠𝐞 𝐰𝐢𝐭𝐡 𝐭𝐡𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝.", event.threadID, event.messageID);
        }

        const hasan = event.messageReply.attachments[0].url;
        const baigan = global.GoatBot.config.api.hasan;
        const apiUrl = `${baigan}/rbg?imageUrl=${encodeURIComponent(hasan)}`;

        const response = await axios.get(apiUrl, {
            responseType: 'stream'
        });

        api.sendMessage({
            body: "🙌| 𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐩𝐡𝐨𝐭𝐨",
            attachment: response.data
        }, event.threadID, event.messageID);

    } catch (e) {
        api.sendMessage(`Error: ${e.message}`, event.threadID, event.messageID);
    }
};
