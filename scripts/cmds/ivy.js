const axios = require("axios");
const { resolve } = require("path");
const { createWriteStream, createReadStream, unlinkSync } = require("fs");

module.exports = {
    config: {
        name: "ivy",
        aliases: [],
        version: "1.1",
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
        await generateAIResponse(message, event, args.join(" "));
    },

    onReply: async function ({ message, event }) {
        if (!event.body) return message.reply("❌ Please reply with a valid text.");
        await generateAIResponse(message, event, event.body);
    }
};

async function generateAIResponse(message, event, promptText) {
    try {
        const apiKey = global.GoatBot.config.api.hasan;
        if (!apiKey) {
            return message.reply("❌ API key not found. Please set up your API key in config.");
        }

        const aiRes = await axios.get(`${apiKey}/ai`, { params: { text: promptText } });
        const aiResponse = aiRes?.data?.choices?.[0]?.message?.content;

        if (!aiResponse) {
            return message.reply("❌ Failed to get a response, try again later.");
        }

        const filePath = resolve(__dirname, "cache", `${event.threadID}_${event.senderID}.mp3`);
        let audioStream = null;

        try {
            const ttsRes = await axios.get(`${apiKey}/tts`, { params: { prompt: aiResponse }, responseType: "stream" });
            if (ttsRes.data) {
                const writer = createWriteStream(filePath);
                ttsRes.data.pipe(writer);
                await new Promise((resolve, reject) => {
                    writer.on("finish", resolve);
                    writer.on("error", reject);
                });
                audioStream = createReadStream(filePath);
            }
        } catch (ttsError) {
            console.warn("⚠️ TTS API Failed:", ttsError.message);
        }

        message.reply({ 
            body: aiResponse, 
            ...(audioStream && { attachment: audioStream })
        }, (err, info) => {
            if (!err && info) {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: "ivy",
                    messageID: info.messageID
                });
            }
            if (audioStream) {
                try {
                    unlinkSync(filePath);
                } catch (unlinkError) {
                    console.error("❌ Failed to delete audio file:", unlinkError.message);
                }
            }
        });

    } catch (error) {
        console.error("❌ Error in ivy command:", error);
        message.reply(`❌ An error occurred: ${error.message}`);
    }
}