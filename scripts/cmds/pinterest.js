const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "pin",
    aliases: ["pinterest"],
    version: "2.0",
    author: "♡︎ 𝐻𝐴𝑆𝐴𝑁 ♡︎",
    role: 0,
    countDown: 5,
    shortDescription: { en: "Search images on Pinterest" },
    category: "image",
    guide: { en: "{prefix}pin <search query> -<number of images>" }
  },

  onStart: async function ({ api, event, args }) {
    try {
      const w = await api.sendMessage("🔍 | Please wait...", event.threadID);
      const src = args.join(" ");
      
      if (!src.includes("-")) {
        return api.sendMessage(`❌ Invalid format!\nExample: {prefix}pin cat -5`, event.threadID, event.messageID);
      }

      const [query, numImages] = src.split("-").map(str => str.trim());
      const limit = parseInt(numImages);

      if (isNaN(limit) || limit <= 0 || limit > 40) {
        return api.sendMessage("❌ Please specify a number between 1 and 40.", event.threadID, event.messageID);
      }

      const hasan = global.GoatBot.config.api.apis;
      const response = await axios.get(`${hasan}/pinterest?search=${encodeURIComponent(query)}&limit=${encodeURIComponent(limit)}`);
      const imageData = response.data.data;
      const count = response.data.count;

      if (!Array.isArray(imageData) || imageData.length === 0) {
        return api.sendMessage(`❌ No images found for "${query}".`, event.threadID, event.messageID);
      }

      const cacheFolder = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheFolder)) fs.mkdirSync(cacheFolder);

      const imgData = [];
      for (let i = 0; i < Math.min(limit, imageData.length); i++) {
        try {
          const imgResponse = await axios.get(imageData[i], { responseType: 'arraybuffer' });
          const imgPath = path.join(cacheFolder, `pin_${i + 1}.jpg`);
          await fs.outputFile(imgPath, imgResponse.data);
          imgData.push(fs.createReadStream(imgPath));
        } catch (error) {
          console.error(`Error downloading image ${i + 1}:`, error);
        }
      }

      await api.sendMessage({ attachment: imgData, body: `✅ | Here are your pictures!\nSearch base: "${query}"\nLimit: ${count}` }, event.threadID, event.messageID);

      setTimeout(() => {
        fs.emptyDirSync(cacheFolder);
      }, 60000);

    } catch (error) {
      console.error(error);
      return api.sendMessage("❌ An error occurred while fetching images.", event.threadID, event.messageID);
    }
  }
};