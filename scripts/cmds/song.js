const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "song",
    aliases: [],
    version: "1.0",
    author: "♡︎ 𝐻𝐴𝑆𝐴𝑁 ♡︎",
    countDown: 2,
    role: 0,
    description: {
      en: "song from SoundCloud",
    },
    category: "media",
    guide: {
      en: "{pn} [song_name]",
    },
  },

  onStart: async function ({ api, args, event }) {
    const hasan = global.GoatBot.config.api.api;
    const songName = args.join(" ");
    if (!songName) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      return api.sendMessage("⁉️ | Please provide a song name.", event.threadID, event.messageID);
    }

    try {
      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const searchResponse = await axios.get(`${hasan}/SoundCloudsearch?query=${encodeURIComponent(songName)}`);
      if (!searchResponse.data || searchResponse.data.length === 0) {
        throw new Error("Song not found!");
      }
      const spotifyUrl = searchResponse.data[0].permalink_url;

      const downloadResponse = await axios.get(`${hasan}/soundcloud?url=${encodeURIComponent(spotifyUrl)}`);
      if (!downloadResponse.data || !downloadResponse.data.cloudinary_url) {
        throw new Error("Download link not found. Check your API.");
      }

      const downloadLink = downloadResponse.data.cloudinary_url;
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
            body: "✨ | Here is your song from soundcloud..!!",
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
