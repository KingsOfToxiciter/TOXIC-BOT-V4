const axios = require("axios");

module.exports.config = {
    name: "cbg",
    aliases: ["changebg", "backgroundchange"],
    version: "1.0",
    author: "♡︎ 𝐻𝐴𝑆𝐴𝑁 ♡︎",
    countDown: 3, 
    role: 0,
    longDescription: {
        en: "background change on your images"
    },
    category: "changebg",
    guide: {
        en: "{pn} reply to an image with a prompt for background change"
    } 
};

module.exports.onStart = async ({ api, event, args }) => {
    try {
         const prompt = args.join(" ");
        if (!prompt || !event.messageReply || !event.messageReply.attachments || !event.messageReply.attachments[0]) {
            return api.sendMessage("Please reply to an image with the background prompt", event.threadID, event.messageID);
        }

        const hasan = event.messageReply.attachments[0].url;
        const baigan = global.GoatBot.config.api.hasan;
        const apiUrl = `${baigan}/cbg?imageUrl=${encodeURIComponent(hasan)}&prompt=${prompt}`;

        const response = await axios.get(apiUrl, {
            responseType: 'stream'
        });

        api.sendMessage({
            body: "✅ | Here is your background change photo",
            attachment: response.data
        }, event.threadID, event.messageID);

    } catch (e) {
        api.sendMessage(`Error: ${e.message}`, event.threadID, event.messageID);
    }
};