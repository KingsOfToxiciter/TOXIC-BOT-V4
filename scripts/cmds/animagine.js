module.exports = {
  config: {
    name: "animagine",
    aliases: ["anigen"],
    version: "1.0",
    author: "Anas & ♡︎ 𝐻𝑎𝑠𝑎𝑛 ♡︎",
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
        "Type {pn} with your prompts",
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
      const waitingMessage = await message.reply("⏰ | Creating your Imagination...");

      // Build the API URL using the provided prompt
      const API = `https://hasan-animagine-api.onrender.com/imagine?prompt=${encodeURIComponent(prompt)}`;

      // Make the API call to get the image quickly
      const imageStream = await global.utils.getStreamFromURL(API);

      // Send the generated image as an attachment
      await message.reply({
        attachment: imageStream,
      });

      // Unsending the waiting message and sending the final response
      await api.unsendMessage(waitingMessage.messageID);

    } catch (error) {
      console.log(error);
      message.reply("Failed to generate the image. Please try again later.");
    }
  },
};