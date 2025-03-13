const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "gan",
    aliases:["song", "surah"],
    version: "1.0",
    author: "♡︎ 𝐻𝐴𝑆𝐴𝑁 ♡︎",
    countDown: 2,
    role: 0,
    description: {
      en: "Download audio from given keyword.",
    },
    category: "MEDIA",
    guide: {
      en: "{pn} song name ",
    },
  },

  onStart: async function ({ api, args, event }) {
    const h = args.join(" ");
    const hasan = await axios.get(`https://hasan-all-apis.onrender.com/ytb-search?songName=${h}`);

    if (!hasan.data || hasan.data.length === 0 || !hasan.data[0].videoId) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      return api.sendMessage("⁉️ | No video found for the given name.", event.threadID, event.messageID);
    }

    const videoID = hasan.data[0].videoId;
    const title = hasan.data[0].title;

    try {
      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const response = await axios.get(`https://fastapi-nyx-production.up.railway.app/y?url=https://www.youtube.com/watch?v=${videoID}&type=mp3`);

      if (!response.data || !response.data.url) {
        throw new Error("❌ | API response error. Please check the API status.");
      }

      const videoDownloadLink = response.data.url;

      const cachePath = path.join(__dirname, "cache");
      if (!fs.existsSync(cachePath)) {
        fs.mkdirSync(cachePath);
      }

      const filePath = path.join(cachePath, "video.mp3");
      const { data } = await axios.get(videoDownloadLink, { responseType: "stream" });

      const writer = fs.createWriteStream(filePath);
      data.pipe(writer);

      writer.on("finish", () => {
        api.setMessageReaction("✅", event.messageID, () => {}, true);
        api.sendMessage(
          {
            body: `✨ | Here is your audio: ${title}`,
            attachment: fs.createReadStream(filePath),
          },
          event.threadID,
          () => fs.unlinkSync(filePath),
          event.messageID
        );
      });

      writer.on("error", (err) => {
        console.error("❌ | File writing error:", err.message);
        api.sendMessage("❌ | File writing error occurred!", event.threadID, event.messageID);
      });

    } catch (error) {
      api.setMessageReaction("❎", event.messageID, () => {}, true);
      api.sendMessage(`❌ | Error:\n${error.message}`, event.threadID, event.messageID);
    }
  },
};