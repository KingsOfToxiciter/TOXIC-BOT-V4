const axios = require('axios');
const dipto = global.GoatBot.config.api.apis;

module.exports.config = {
    name: "edit",
    version: "6.9",
    author: "dipto",
    countDown: 5,
    role: 0,
    category: "AI",
    description: "Edit images using Edit AI",
    guide: {
        en: "Reply to an image with {pn} [prompt]"
    }
};

async function handleEdit(api, event, args, commandName) {
    try {
        const url = event.messageReply?.attachments?.[0]?.url;
        if (!url) throw new Error("❌ Please reply to an image to edit it.");

        const prompt = args.join(" ") || "Enhance this image";
        const response = await axios.get(`${dipto}/edit?url=${encodeURIComponent(url)}&prompt=${encodeURIComponent(prompt)}`, {
            responseType: 'stream',
            validateStatus: () => true
        });

        const contentType = response.headers['content-type'];
        if (contentType?.startsWith('image/')) {
            return sendMessage(api, event, { attachment: response.data }, commandName);
        }

        let responseData = '';
        for await (const chunk of response.data) {
            responseData += chunk.toString();
        }
        
        const jsonData = JSON.parse(responseData);
        if (jsonData?.response) {
            return sendMessage(api, event, jsonData.response, commandName);
        }

        throw new Error("❌ No valid response from the API");
    } catch (error) {
        console.error("Edit command error:", error.message || error);
        return sendMessage(api, event, error.message || "❌ Failed to process your request. Please try again later.", commandName);
    }
}

function sendMessage(api, event, message, commandName) {
    return api.sendMessage(message, event.threadID, (error, info) => {
        if (!error) {
            global.GoatBot.onReply.set(info.messageID, {
                commandName,
                type: "reply",
                messageID: info.messageID,
                author: event.senderID,
            });
        }
    }, event.messageID);
}

module.exports.onStart = async ({ api, event, args }) => {
    if (!event.messageReply) {
        return api.sendMessage("❌ Please reply to an image to edit it.", event.threadID, event.messageID);
    }
    await handleEdit(api, event, args, module.exports.config.name);
};

module.exports.onReply = async function ({ api, event, args }) {
    if (event.type === "message_reply") {
        await handleEdit(api, event, args, module.exports.config.name);
    }
};