const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "song",
    aliases: ["gan", "surah"],
    version: "1.0",
    author: "♡︎ 𝐻𝐴𝑆𝐴𝑁 ♡︎",
    countDown: 2,
    role: 0,
    description: {
      en: "Download video from given URL.",
    },
    category: "MEDIA",
    guide: {
      en: "[song_name]",
    },
  },

  onStart: async function ({ api, args, event }) {
    const songName = args.join(" ");
    if (!songName) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      return api.sendMessage("⁉️ | Please provide a song name.", event.threadID, event.messageID);
    }

    try {
      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const searchResponse = await axios.get(`https://hasan-all-apis.onrender.com/ytb-search?songName=${encodeURIComponent(songName)}`);
      if (!searchResponse.data || searchResponse.data.length === 0) {
        throw new Error("Song not found!");
      }
      const videoId = searchResponse.data[0].videoId;

      const downloadResponse = await axios.get(`https://www.noobs-api.rf.gd/dipto/ytDl3?link=${videoId}&format=mp3`);
      if (!downloadResponse.data || !downloadResponse.data.downloadLink) {
        throw new Error("Download link not found. Check your API.");
      }

      const downloadLink = downloadResponse.data.downloadLink;
      const cachePath = path.join(__dirname, "cache");
      if (!fs.existsSync(cachePath)) {
        fs.mkdirSync(cachePath);
      }

      const filePath = path.join(cachePath, "audio.mp3");
      const { data } = await axios.get(downloadLink, { responseType: "stream" });
      const writer = fs.createWriteStream(filePath);
      data.pipe(writer);

      writer.on("finish", () => {
        api.setMessageReaction("✅", event.messageID, () => {}, true);
        api.sendMessage(
          {
            body: "✨ | Here is your song!",
            attachment: fs.createReadStream(filePath),
          },
          event.threadID,
          () => fs.unlinkSync(filePath),
          event.messageID
        );
      });

      writer.on("error", (err) => {
        throw err;
      });

    } catch (error) {
      api.setMessageReaction("❎", event.messageID, () => {}, true);
      api.sendMessage(`❌ | Error:\n${error.message}`, event.threadID, event.messageID);
    }
  },
};