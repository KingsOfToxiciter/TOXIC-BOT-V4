const axios = require("axios");

module.exports.config = {
    name: "art",
    aliases: [],
    version: "1.0",
    author: "♡︎ 𝐻𝐴𝑆𝐴𝑁 ♡︎",
    countDown: 3, 
    role: 0,
    longDescription: {
        en: "convert to anime style to your images"
    },
    category: "tools",
    guide: {
        en: "{pn} reply to an image for art"
    } 
};

module.exports.onStart = async ({ api, event, args }) => {
    try {
        if (!event.messageReply || !event.messageReply.attachments || !event.messageReply.attachments[0]) {
            return api.sendMessage("𝘗𝘭𝘦𝘢𝘴𝘦 𝘳𝘦𝘱𝘭𝘺 𝘵𝘰 𝘢𝘯 𝘪𝘮𝘢𝘨𝘦 𝘸𝘪𝘵𝘩 𝘵𝘩𝘪𝘴 𝘤𝘮𝘥.", event.threadID, event.messageID);
        }

        const hasan = event.messageReply.attachments[0].url;
        const baigan = global.GoatBot.config.api.hasan;
        const apiUrl = `${baigan}/art?imageUrl=${encodeURIComponent(hasan)}`;

        const response = await axios.get(apiUrl, {
            responseType: 'stream'
        });

        api.sendMessage({
            body: "😽 𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐢𝐦𝐚𝐠𝐞",
            attachment: response.data
        }, event.threadID, event.messageID);

    } catch (e) {
        api.sendMessage(`Error: ${e.message}`, event.threadID, event.messageID);
    }
};