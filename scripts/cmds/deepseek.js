const axios = require("axios");


module.exports = {
    config: {
        name: "deepseek",
        aliases: ["ds"],
        version: "1.0",
        author: "♡︎ 𝐻𝐴𝑆𝐴𝑁 ♡︎",
        countDown: 5,
        role: 0,
        description: {
            en: "Generate AI response using DeepSeek."
        },
        category: "AI",
        guide: {
            en: "{pn} [text] - Get an AI-generated response.\nReply to the bot's message for follow-up responses."
        }
    },

    onStart: async function ({ message, args, event }) {
        if (args.length === 0) return message.reply("❌ Please provide a prompt.");

        const promptText = args.join(" ");
        await generateAIResponse(message, event.senderID, promptText);
    },

    onReply: async function ({ message, event }) {
        const repliedText = event.body;
        if (!repliedText) return message.reply("❌ Please reply with a valid text.");

        await generateAIResponse(message, event.senderID, repliedText);
    }
};

async function generateAIResponse(message, senderID, promptText) {
    try {
        const hasan = global.GoatBot.config.api.api;
        const response = await axios.get(`${hasan}/deepseek?prompt=${encodeURIComponent(promptText)}&type=v3`);

        if (!response.data) {
            return message.reply("❌ Failed to get a response, try again later.");
        }

        const aiResponse = response.data;

        message.reply(`${aiResponse}`, (err, info) => {
            if (!err) {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: "deepseek",
                    messageID: info.messageID
                });
            }
        });

    } catch (error) {
        message.reply("❌ An error occurred, please try again later.");
    }
}