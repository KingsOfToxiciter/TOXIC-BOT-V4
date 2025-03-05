const axios = require("axios");
const fs = require('fs');

const baseApiUrl = async () => {
    const base = await axios.get(
        `https://raw.githubusercontent.com/KingsOfToxiciter/YouTube-Download/refs/heads/main/hasan.json`
    );
    return base.data.api;
};

module.exports = {
    config: {
        name: "sing",
        version: "1.0.0",
        aliases: ['music'],
        author: "dipto",
        countDown: 5,
        role: 0,
        description: {
            en: "Download audio (MP3) from YouTube"
        },
        category: "media",
        guide: {
            en: "{pn} [<video name>|<video link>]: Download audio from YouTube\nExample:\n{pn} despacito\n{pn} https://youtu.be/abcd1234"
        }
    },

    onStart: async ({ api, args, event, commandName }) => {
        if (args.length === 0) {
            return api.sendMessage("❌ Please provide a YouTube video link or name.", event.threadID, event.messageID);
        }

        const checkurl = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
        const isUrl = checkurl.test(args[0]);
        let videoID;

        if (isUrl) {
            const match = args[0].match(checkurl);
            videoID = match ? match[1] : null;
        } else {
            // সার্চ করার জন্য ইউজারের ইনপুট নেয়া
            const keyWord = args.join(" ");
            const maxResults = 5;
            let result;

            try {
                result = (await axios.get(`${await baseApiUrl()}/ytFullSearch?songName=${keyWord}`)).data.slice(0, maxResults);
            } catch (err) {
                return api.sendMessage("❌ Error fetching search results: " + err.message, event.threadID, event.messageID);
            }

            if (result.length === 0) {
                return api.sendMessage("⭕ No results found for: " + keyWord, event.threadID, event.messageID);
            }

            let msg = "Select a song by replying with the number:\n";
            result.forEach((info, index) => {
                msg += `${index + 1}. ${info.title} | Channel: ${info.channel.name}\n`;
            });

            return api.sendMessage(msg, event.threadID, (err, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName,
                    messageID: info.messageID,
                    author: event.senderID,
                    result
                });
            }, event.messageID);
        }

        if (videoID) {
            await downloadAudio(api, event, videoID);
        }
    },

    onReply: async ({ event, api, Reply }) => {
        const { result } = Reply;
        const choice = parseInt(event.body);

        if (isNaN(choice) || choice <= 0 || choice > result.length) {
            return api.sendMessage('❌ Invalid choice. Please reply with a valid number.', event.threadID, event.messageID);
        }

        const selectedVideo = result[choice - 1];
        const videoID = selectedVideo.id;

        api.unsendMessage(Reply.messageID);
        await downloadAudio(api, event, videoID);
    }
};

async function downloadAudio(api, event, videoID) {
    try {
        const format = 'mp3';
        const path = `ytb_audio_${videoID}.${format}`;
        const { data: { title, downloadLink, quality } } = await axios.get(`${await baseApiUrl()}/ytDl3?link=${videoID}&format=${format}&quality=3`);

        await api.sendMessage({
            body: `🎵 Title: ${title}\n🔊 Quality: ${quality}`,
            attachment: await fetchFile(downloadLink, path)
        }, event.threadID, () => fs.unlinkSync(path), event.messageID);
    } catch (e) {
        console.error(e);
        return api.sendMessage('❌ Failed to download audio. Please try again later.', event.threadID, event.messageID);
    }
}

async function fetchFile(url, pathName) {
    try {
        const response = (await axios.get(url, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(pathName, Buffer.from(response));
        return fs.createReadStream(pathName);
    } catch (err) {
        throw err;
    }
        }
