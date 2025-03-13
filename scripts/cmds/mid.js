module.exports = {
  config: {
    name: "mid",
    aliases: ["🍆"],
    version: "1.0",
    author: "♡︎ 𝐻𝑎𝑠𝑎𝑛 ♡︎",
    countDown: 3, // Reduced countdown for faster response
    role: 0,
    longDescription: {
      vi: "",
      en: "Get images from text.",
    },
    category: "image",
    guide: {
      vi: "",
      en:
        "{pn} prompt to generate image with midjourney ai",
    },
  },

  onStart: async function ({ api, args, message, event }) {
    try {
      const text = args.join(" ");
      if (!text) {
        return message.reply("Please provide a prompt.");
      }

      let prompt = text;


      const waitingMessage = await message.reply("🕛 rukja rukja thuda cha sabar karle...");
          api.setMessageReaction("⏱️", event.messageID, () => {}, true);

      const h = global.GoatBot.config.api.hasan;
      const API = `${h}/midjourney?prompt=${encodeURIComponent(prompt)}`;

     
      const imageStream = await global.utils.getStreamFromURL(API);

     
      await message.reply({
        attachment: imageStream,
      });

api.setMessageReaction("✅", event.messageID, () => {}, true);

           await api.unsendMessage(waitingMessage.messageID);

    } catch (error) {
      console.log(error);
      message.reply("Failed to generate the image. Please try again later.");
    }
  },
};
