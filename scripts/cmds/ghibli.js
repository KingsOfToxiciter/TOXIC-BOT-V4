const axios = require("axios");

module.exports = {
  config: {
    name: "ghibli",
    aliases: [],
    version: "1.0",
    author: "♡︎ 𝐻𝑎𝑠𝑎𝑛 ♡︎",
    countDown: 3, 
    role: 0,
    longDescription: {
      vi: "",
      en: "Get image from your provided prompt",
    },
    category: "image",
    guide: {
      vi: "",
      en: "{pn} prompt to generate image with ghibli art studio",
    },
  },

  onStart: async function ({ api, args, message, event }) {
    try {
      const imageUrl = event.messageReply?.attachments?.[0]?.url;

      if (!imageUrl) {
        return message.reply("Please reply to an image.");
      }

      const toxic = global.GoatBot.config.api.apis;
      const explain = await axios.get(`${toxic}/prompt?url=${encodeURIComponent(imageUrl)}&model=1`);
      const text = explain.data.prompt;

      if (!text) {
        return message.reply("Failed to extract prompt from the image. Please try again.");
      }

      let prompt = `Ghibli Art: ${text}`;

      const waitingMessage = await message.reply("✨ | Creating your Ghibli request...");
      api.setMessageReaction("🖇️", event.messageID, () => {}, true);
      const startTime = new Date().getTime();

      const h = global.GoatBot.config.api.hasan;
      const API = `${h}/ghibli?prompt=${encodeURIComponent(prompt)}`;

      const imageStream = await global.utils.getStreamFromURL(API);
      const endTime = new Date().getTime();
      const timeTaken = (endTime - startTime) / 1000;

      await message.reply({
        body: `Here is your generated image\n\n⏱️𝗧𝗮𝗸𝗲𝗻 𝗧𝗶𝗺𝗲: ${timeTaken} second`,
        attachment: imageStream,
      });

      api.setMessageReaction("✅", event.messageID, () => {}, true);
      await api.unsendMessage(waitingMessage.messageID);

    } catch (error) {
      console.error(error);
      message.reply("Failed to generate the image. Please try again later.");
    }
  },
};