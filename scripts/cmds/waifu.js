const axios = require('axios');

module.exports = {
    config: {
        name: "waifu",
        aliases: ["animegirl"],
        version: "1.0",
        author: "♡︎ 𝐻𝐴𝑆𝐴𝑁 ♡︎",
        countDown: 5,
        role: 0,
        description: {
            en: "Get a random waifu image and description."
        },
        category: "fun",
        guide: {
            en: "{pn} [name] - Get a waifu image by name"
        }
    },

    onStart: async function ({ message, args }) {
        const waifuName = args.join(" ") || "Mikasa";

        try {
            const postData = { search: waifuName };
            const response = await axios.post('https://www.noobz-api.rf.gd/api/waifu', postData);
            const { url, description } = response.data;

            message.reply({
                body: description,
                attachment: await global.utils.getStreamFromURL(url),
            });
        } catch (error) {
            message.reply("❌ can't found anything, try again later");
        }
    }
};