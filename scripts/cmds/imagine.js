module.exports = {
  config: {
    name: "imagine",
    aliases:["text2img", "gen"],
    version: "1.0",
    author: "♡︎ 𝐻𝑎𝑠𝑎𝑛 ♡︎",
    countDown: 3, // Reduced countdown for faster response
    role: 0,
    longDescription: {
      vi: "",
      en: "Get image from your provided prompt",
    },
    category: "image",
    guide: {
      vi: "",
      en: "{pn} prompt to generate image with flux-schnell ai",
    },
  },

  onStart: async function ({ api, args, message, event }) {
    try {
      const text = args.join(" ");
      if (!text) {
        return message.reply("Please provide a prompt.");
      }

      let prompt = text;

      // Send a quick message to indicate the process is ongoing
      const waitingMessage = await message.reply("✨ | creating your request...");
      api.setMessageReaction("⏰", event.messageID, () => {}, true);
      const startTime = new Date().getTime();

      // Build the API URL using the provided prompt
      const API = `https://hasan-imagine-api.onrender.com/img?prompt=${encodeURIComponent(prompt)}`;

      // Make the API call to get the image quickly
      const imageStream = await global.utils.getStreamFromURL(API);
      const endTime = new Date().getTime();
      const timeTaken = (endTime - startTime) / 1000;

      // Send the generated image as an attachment
      await message.reply({
        body: `Here is your generated image\n\n📝𝗽𝗿𝗼𝗺𝗽𝘁: ${prompt}\n⏱️𝗧𝗮𝗸𝗲𝗻 𝗧𝗶𝗺𝗲: ${timeTaken} second`,
        attachment: imageStream,
      });

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      // Unsending the waiting message and sending the final response
      await api.unsendMessage(waitingMessage.messageID);

    } catch (error) {
      console.log(error);
      message.reply("Failed to generate the image. Please try again later.");
    }
  },
};
