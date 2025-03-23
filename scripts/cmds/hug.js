const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
		config: {
				name: "hug",
				version: "1.0",
				author: "SiAM",
				countDown: 5,
				role: 0,
				shortDescription: {
						en: "Send a hug gif to one or two mentioned users.",
				},
				longDescription: {
						en: "This command sends a hug gif to one or two mentioned users.",
				},
				category: "fun",
				guide: {
						en: "To use this command, type /hug followed by one or two user mentions.",
				},
		},

		onStart: async function ({
				api,
				args,
				message,
				event,
				threadsData,
				usersData,
				dashBoardData,
				globalData,
				threadModel,
				userModel,
				dashBoardModel,
				globalModel,
				role,
				commandName,
				getLang,
		}) {


			let uid1 = event.senderID;
			let	uid2 = event.messageReply.senderID;
				const input = args.join(" ");
     if (event.type === "message_reply")
				if (event.mentions && Object.keys(event.mentions).length === 2) {
						uid1 = Object.keys(event.mentions)[0];
						uid2 = Object.keys(event.mentions)[1];
				} else if (event.mentions && Object.keys(event.mentions).length === 1) {
						uid2 = Object.keys(event.mentions)[0];
				} else {
						return message.reply("Please mention one or two users to send a hug gif.");
				}

				const userName1 = await usersData.getName(uid1);
				const userName2 = await usersData.getName(uid2);

				const apiUrl = "https://nekos.best/api/v2/hug?amount=1";
				axios
						.get(apiUrl)
						.then(async (response) => {
								const gifUrl = response.data.results[0].url;
								const imageResponse = await axios.get(gifUrl, { responseType: "arraybuffer" });
								const outputBuffer = Buffer.from(imageResponse.data, "binary");
								fs.writeFileSync(`${uid1}_${uid2}_hug.gif`, outputBuffer);

								message.reply({
										body: `${userName1} 🤗 ${userName2}`,
										attachment: fs.createReadStream(`${uid1}_${uid2}_hug.gif`),
								}, () => fs.unlinkSync(`${uid1}_${uid2}_hug.gif`));
						})
						.catch((error) => {
								console.log(error);
								message.reply("There was an error processing the hug gif.");
						});
		},
};
