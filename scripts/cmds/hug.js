const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
    config: {
        name: "hug",
        version: "1.0",
        author: "♡︎ 𝐻𝐴𝑆𝐴𝑁 ♡︎",
        countDown: 5,
        role: 0,
        shortDescription: { en: "Send a hug GIF." },
        longDescription: { en: "Sends a hug GIF to one or two mentioned users." },
        category: "fun",
        guide: { en: "/hug @user1 [@user2]" },
    },

    onStart: async function ({ api, args, message, event, usersData }) {
        let uid1 = null;
        let uid2 = null;

        if (event.type === "message_reply") {
            uid1 = event.senderID;
            uid2 = event.messageReply.senderID;
        } 
        else if (event.mentions && Object.keys(event.mentions).length > 0) {
            const mentionedUsers = Object.keys(event.mentions);
            uid1 = event.senderID;
            uid2 = mentionedUsers[0];

            if (mentionedUsers.length > 1) {
                uid1 = mentionedUsers[0];
                uid2 = mentionedUsers[1];
            }
        }

        if (!uid2) {
            return message.reply("Please mention at least one user or reply to a message.");
        }

        const userName1 = await usersData.getName(uid1);
        const userName2 = await usersData.getName(uid2);

        const apiUrl = "https://nekos.best/api/v2/hug?amount=1";

        try {
            const response = await axios.get(apiUrl);
            const gifUrl = response.data.results[0].url;

            const imageResponse = await axios.get(gifUrl, { responseType: "arraybuffer" });
            const fileName = `${uid1}_${uid2}_hug.gif`;
            await fs.promises.writeFile(fileName, imageResponse.data);

            message.reply({
                body: `${userName1} 🤗 ${userName2}`,
                attachment: fs.createReadStream(fileName),
            }, () => fs.unlinkSync(fileName));
        } catch (error) {
            console.error(error);
            message.reply("An error occurred while sending the hug GIF.");
        }
    },
};