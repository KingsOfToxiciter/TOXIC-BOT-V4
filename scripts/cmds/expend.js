const axios = require("axios");

module.exports.config = {
    name: "expend",
    aliases: [],
    version: "1.0",
    author: "♡︎ 𝐻𝐴𝑆𝐴𝑁 ♡︎",
    countDown: 3, 
    role: 0,
    longDescription: {
        en: "expend your images"
    },
    category: "expend",
    guide: {
        en: "{pn} reply to an image for expend"
    } 
};

module.exports.onStart = async ({ api, event, args }) => {
    try {
        if (!event.messageReply || !event.messageReply.attachments || !event.messageReply.attachments[0]) {
            return api.sendMessage("𝐏𝐥𝐞𝐚𝐬𝐞 𝐫𝐞𝐩𝐥𝐲 𝐭𝐨 𝐚𝐧 𝐢𝐦𝐚𝐠𝐞 𝐰𝐢𝐭𝐡 𝐭𝐡𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝.", event.threadID, event.messageID);
        }

        const hasan = event.messageReply.attachments[0].url;
        const ratioType = args.join(" ");
        
        api.setMessageReaction("✨", event.messageID, () => {}, true);
        let apiUrl = `https://www.noobz-api.rf.gd/api/expend?imageUrl=${encodeURIComponent(hasan)}&ratioType=${ratioType}`;
         
        

        const response = await axios.get(apiUrl, {
            responseType: 'stream'
        });
       
        api.setMessageReaction("✅", event.messageID, () => {}, true);

        api.sendMessage({
            body: "✨| Here is your expended photo",
            attachment: response.data
        }, event.threadID, event.messageID);

    } catch (e) {
        api.sendMessage(`Error: ${e.message}`, event.threadID, event.messageID);
    }
};
