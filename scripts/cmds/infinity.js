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

  onStart: async function ({ api, args, message, event, usersData }) {
    try {
      if (!args.length) {
        return message.reply("Please provide a prompt.");
      }

      let prompt = args.join(" ");
      let model = "realistic"; // Default model set to "realistic"
      let ratio = "1:1"; // Default ratio

      // Check if the first argument matches a model name
      const modelMap = {
        dev: "flux-dev",
        schnell: "flux-schnell",
        turbo: "imagine-turbo",
        anime: "anime",
        devf: "flux-dev-fast",
      };

      if (modelMap[args[0]]) {
        model = modelMap[args[0]];
        args.shift(); // Remove the first argument (model name) from the prompt
        prompt = args.join(" ");
      }

      if (prompt.includes("|")) {
        const [promptText, ratioText] = prompt.split("|").map((str) => str.trim());
        prompt = promptText;

        const allowedRatios = ["1:1", "3:2", "4:3", "3:4", "16:9", "9:16"];
        if (allowedRatios.includes(ratioText)) {
          ratio = ratioText;
        }
      }

      // Indicate that the process has started
      const waitingMessage = await message.reply("✨ | Creating your ultra realistic Image...");
      api.setMessageReaction("✨", event.messageID, () => {}, true);

      // API request with model & ratio
      const API = `https://hasan-infinity-api.onrender.com/img?prompt=${encodeURIComponent(prompt)}&model=${model}&ratio=${ratio}`;
      const imageStream = await global.utils.getStreamFromURL(API);

      const hasan = await usersData.getName(event.senderID);

      // Send the generated image
      await message.reply({
        body: `🎊 | 𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐮𝐥𝐭𝐫𝐚 𝐫𝐞𝐚𝐥𝐢𝐬𝐭𝐢𝐜 𝐢𝐦𝐚𝐠𝐞.\n\n𝐶𝑟𝑒𝑎𝑡𝑒𝑑 𝑏𝑦: ♡︎ ${hasan} ♡︎\n\n🏞️ Model Used: ${model}\n🔖 Ratio Used: ${ratio}`,
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