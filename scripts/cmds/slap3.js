const Jimp = require("jimp");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "slap3",
    version: "1.0",
    author: "♡︎ 𝐻𝐴𝑆𝐴𝑁 ♡︎",
    countDown: 5,
    role: 0,
    shortDescription: "Batslap image",
    longDescription: "Batslap image",
    category: "image",
    guide: {
      en: "{pn} @tag or reply to a message"
    }
  },

  langs: {
    en: {
      noTag: "You must tag the person you want to slap or reply to their message",
    }
  },

  onStart: async function ({ event, message, usersData, args, getLang }) {
    const uid1 = event.senderID;
    let uid2 = Object.keys(event.mentions)[0];

    if (!uid2 && event.type == "message_reply") {
      uid2 = event.messageReply.senderID;
    }

    if (uid2 === "100068909067279") {
      return message.reply("slap yourself hala bkcd!? this is my owner 🦆💨");
    }

    if (!uid2) return message.reply(getLang("noTag"));

    const avatarURL1 = await usersData.getAvatarUrl(uid1);
    const avatarURL2 = await usersData.getAvatarUrl(uid2);

    const slapBg = await Jimp.read(`${__dirname}/assist_json/slap.png`);
    let avatar1 = await Jimp.read(avatarURL1);
    let avatar2 = await Jimp.read(avatarURL2);
        
        avatar1 = avatar1.resize(170, 170).circle();
        avatar2 = avatar2.resize(170, 170).circle();


    slapBg.composite(avatar1, 650, 20); // প্রথম ইউজারের অ্যাভাটার সেট
    slapBg.composite(avatar2, 130, 40); // দ্বিতীয় ইউজারের অ্যাভাটার সেট

    const pathSave = `${__dirname}/tmp/${uid1}_${uid2}Batslap.png`;
    await slapBg.writeAsync(pathSave);

    const content = args.join(' ').replace(Object.keys(event.mentions)[0], "");
    message.reply(
      {
        body: `${content || "chup nah hoy arekhta dimu 🙂✌️"}`,
        attachment: fs.createReadStream(pathSave)
      },
      () => fs.unlinkSync(pathSave)
    );
  }
};
