const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports = {
    config: {
        name: "kiss2",
        aliases: ["kiss2"],
        version: "1.0",
        author: "NIB",
        countDown: 5,
        role: 0,
        shortDescription: "KISS",
        longDescription: "",
        category: "fun",
        guide: "{pn}"
    },

    onStart: async function ({ api, message, event, args, usersData }) {
        let one, two;
        const mention = Object.keys(event.mentions);

        if (event.type === "message_reply") {
            two = event.senderID;
            one = event.messageReply.senderID; // রিপ্লাই করা মেসেজের ইউজার আইডি
        } 
        else if (mention.length === 1) {
            two = event.senderID;
            one = mention[0];
        } 
        else if (mention.length > 1) {
            one = mention[1];
            two = mention[0];
        } 
        else {
            return message.reply("Please mention someone or reply to a message.");
        }

        const avatarURL1 = await usersData.getAvatarUrl(one);
        const avatarURL2 = await usersData.getAvatarUrl(two);
        const img = await new DIG.Kiss().getImage(avatarURL1, avatarURL2);
        const pathSave = `${__dirname}/tmp/${one}_${two}kiss.png`;

        fs.writeFileSync(pathSave, Buffer.from(img));
        
        message.reply({
            body: "Ummmmmmmmmmmmmmmmmmaaaaaaaahhhhh bby 🥵😘",
            attachment: fs.createReadStream(pathSave)
        }, () => fs.unlinkSync(pathSave));
    }
};
