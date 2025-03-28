const axios = require('axios');

module.exports = {
    config: {
        name: "imgur",
        version: "1.0",
        role: 0,
        author: "♡ 𝐻𝐴𝑆𝐴𝑁 ♡",
        shortDescription: "imgur upload",
        countDown: 0,
        category: "tools",
        guide: {
            en: '[reply to image]'
        }
    },

    onStart: async ({ api, event }) => {
        let link;

        if (event.type === "message_reply" && event.messageReply.attachments.length > 0) {
            link = event.messageReply.attachments[0].url;
        } else if (event.attachments.length > 0) {
            link = event.attachments[0].url;
        } else {
            return api.sendMessage('No attachment detected. Please reply to an image.', event.threadID, event.messageID);
        }

        try {

    const toxiciter = global.GoatBot.config.api.apis;
            const response = await axios.get(`${toxiciter}/imgur?url=${encodeURIComponent(link)}`);
            const link2 = response.data.data;
            return api.sendMessage(`\n\n${link2}`, event.threadID, event.messageID);
        } catch (error) {
            console.error("Error uploading image to Imgur:", error);
            return api.sendMessage("An error occurred while uploading the image to Imgur.", event.threadID, event.messageID);
        }
    }
};