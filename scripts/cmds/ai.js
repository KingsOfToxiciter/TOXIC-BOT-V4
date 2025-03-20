const axios = require("axios");

module.exports = {
    config: {
        name: "ai",
        aliases: [],
        version: "1.0",
        author: "♡︎ 𝐻𝐴𝑆𝐴𝑁 ♡︎",
        countDown: 5,
        role: 0,
        description: {
            en: "Generate AI response using gpt-4o-mini"
        },
        category: "AI",
        guide: {
            en: "{pn} [text] - Get an AI-generated response.\nReply to the bot's message for follow-up responses."
        }
    },

    onStart: async function ({ message, args, event }) {
        if (args.length === 0) return message.reply("❌ Please provide a prompt.");
        const senderID = event.senderID;
        const promptText = args.join(" ");
        await generateAIResponse(message, senderID, promptText);
    },

    onReply: async function ({ message, event }) {
        const senderID = event.senderID;
        const repliedText = event.body;
        if (!repliedText) return message.reply("❌ Please reply with a valid text.");
        await generateAIResponse(message, senderID, repliedText);
    }
};

async function generateAIResponse(message, senderID, promptText) {
    try {
        const hasan = global.GoatBot.config.api.hasan;
        if (!hasan) return message.reply("❌ API key not found.");

        const response = await axios.get(`${hasan}/chat`, {
            params: { text: promptText, id: senderID }
        });

        if (!response.data.response) {
            return message.reply("❌ Failed to get a response, try again later.");
        }

        const aiResponse = response.data.response;

        message.reply(aiResponse, (err, info) => {
            if (!err && info) {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: "ai",
                    messageID: info.messageID
                });
            }
        });

    } catch (error) {
        message.reply("❌ An error occurred, please try again later.");
    }
}