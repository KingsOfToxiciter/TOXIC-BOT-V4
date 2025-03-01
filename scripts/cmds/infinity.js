module.exports = {
  config: {
    name: "infinity",
    version: "1.2",
    author: "♡︎ 𝐻𝑎𝑠𝑎𝑛 ♡︎",
    countDown: 3,
    role: 0,
    longDescription: {
      vi: "",
      en: "Get images from text.",
    },
    category: "image",
    guide: {
      vi: "",
      en:
        "Type {pn} with your prompts\nExample: {pn} cute dog\nYou can also specify a model and ratio (optional).\nExample: {pn} cute dog | anime | 1:1",
    },
  },

  onStart: async function ({ api, args, message, event }) {
    try {
      const text = args.join(" ");
      if (!text) {
        return message.reply("Please provide a prompt.");
      }

      let prompt = text;
      let model = "realistic"; // Default model set to "realistic"
      let ratio = "1:1"; // Default ratio

      if (text.includes("|")) {
        const [promptText, modelText, ratioText] = text.split("|").map((str) => str.trim());
        prompt = promptText;
        
        // Only accept predefined models
        const allowedModels = ["realistic", "flux-dev", "flux-dev-fast", "anime", "flux-schnell", "imagine-turbo"];
        if (allowedModels.includes(modelText.toLowerCase())) {
          model = modelText.toLowerCase();
        }
        
        const allowedRatio = ["1:1", "3:2", "4:3", "3:4", "16:9", "9:16"];
        if (allowedRatio.includes(ratioText.toLowerCase())) {
          ratio = ratioText.toLowerCase();
        }
      }

      // Indicate that the process has started
      const waitingMessage = await message.reply("✨ | Creating your ultra realistic Image...");
      api.setMessageReaction("✨", event.messageID, () => {}, true);

      // API request with model & ratio
      const API = `https://hasan-infinity-api.onrender.com/img?prompt=${encodeURIComponent(prompt)}&model=${model}&ratio=${ratio}`;
      const imageStream = await global.utils.getStreamFromURL(API);

      // Send the generated image
      await message.reply({
        body: `🎊 | 𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐮𝐥𝐭𝐫𝐚 𝐫𝐞𝐚𝐥𝐢𝐬𝐭𝐢𝐜 𝐢𝐦𝐚𝐠𝐞.\n\n𝐶𝑟𝑒𝑎𝑡𝑒𝑑 𝑏𝑦: ♡︎ 𝐇𝐀𝐒𝐀𝐍 ♡︎\n\n🏞️ Model Used: ${model}\n🔖 Ratio Used: ${ratio}`,
        attachment: imageStream,
      });

      // Change reaction
      setTimeout(() => {
        api.setMessageReaction("💗", event.messageID, () => {}, true);
      }, 2000);

      // Unsending waiting message
      await api.unsendMessage(waitingMessage.messageID);
    } catch (error) {
      console.error(error);
      message.reply("Failed to generate the image. Please try again later.");
    }
  },
};
