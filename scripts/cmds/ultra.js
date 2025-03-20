module.exports = {
  config: {
    name: "ultra",
    aliases:[],
    version: "1.0",
    author: "♡︎ 𝐻𝑎𝑠𝑎𝑛 ♡︎",
    countDown: 3, 
    role: 2,
    longDescription: {
      vi: "",
      en: "Get image from your provided prompt",
    },
    category: "image",
    guide: {
      vi: "",
      en: "{pn} prompt to generate image with stable diffusion ai",
    },
  },

  onStart: async function ({ api, args, message, event }) {
    try {
      const text = args.join(" ");
      if (!text) {
        return message.reply("Please provide a prompt.");
      }

      let prompt = text;

      
      const waitingMessage = await message.reply("✨ | creating your imagination...");
      api.setMessageReaction("⏱️", event.messageID, () => {}, true);
      const startTime = new Date().getTime();


      const a = global.GoatBot.config.api.hasan;
      const API = `${a}/ultra?prompt=${encodeURIComponent(prompt)}`;

      
      const imageStream = await global.utils.getStreamFromURL(API);
      const endTime = new Date().getTime();
      const timeTaken = (endTime - startTime) / 1000;

      
      await message.reply({
        body: `Here is your generated image\n\n🗒️𝗽𝗿𝗼𝗺𝗽𝘁: ${prompt}\n⏱️𝗧𝗮𝗸𝗲𝗻 𝗧𝗶𝗺𝗲: ${timeTaken} second`,
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