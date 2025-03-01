const { getTime, drive } = global.utils;
if (!global.temp.welcomeEvent)
	global.temp.welcomeEvent = {};

module.exports = {
	config: {
		name: "welcome",
		version: "1.7",
		author: "NTKhang",
		category: "events"
	},

	langs: {
		vi: {
			session1: "sáng",
			session2: "trưa",
			session3: "chiều",
			session4: "tối",
			welcomeMessage: "Cảm ơn bạn đã mời tôi vào nhóm!\nPrefix bot: %1\nĐể xem danh sách lệnh hãy nhập: %1help",
			multiple1: "bạn",
			multiple2: "các bạn",
			defaultWelcomeMessage: "Xin chào {userName}.\nChào mừng bạn đến với {boxName}.\nChúc bạn có buổi {session} vui vẻ!"
		},
		en: {
			session1: "𝙈𝙤𝙧𝙣𝙞𝙣𝙜",
			session2: "𝙉𝙤𝙤𝙣",
			session3: "𝘼𝙛𝙩𝙚𝙧𝙣𝙤𝙤𝙣",
			session4: "𝙀𝙫𝙚𝙣𝙞𝙣𝙜",
			welcomeMessage: `♡︎ 𝘼𝙎𝙎𝘼𝙇𝘼𝙈𝙐𝘼𝙇𝘼𝙄𝙆𝙐𝙈 ♡︎\n	 `
				+ `\n ᪥ 𝑇𝐻𝐸 𝐵𝑂𝑇 𝐻𝐴𝑆 𝐵𝐸𝐸𝑁 𝐶𝑂𝑁𝑁𝐸𝐶𝑇𝐸𝐷 𝑇𝑂 𝑇𝐻𝐸 𝐺𝑅𝑂𝑈𝑃 `
				+ `\n 𖤍 𝘽𝙊𝙏 𝙋𝙍𝙀𝙁𝙄𝙓 𖤍: %1`
				+ `\n __________________________`
				+ `\n ♕︎ 𝙊𝙒𝙉𝙀𝙍 ♕︎:https://www.facebook.com/Itz.HaSaN.00`
				+ `\n __________________________`
				+ `\n ❀| 𝙏𝙊 𝙑𝙄𝙀𝙒 𝘾𝙊𝙈𝙈𝘼𝙉𝘿𝙎 𝙋𝙇𝙀𝘼𝙎𝙀 𝙀𝙉𝙏𝙀𝙍: %1𝙝𝙚𝙡𝙥`,
			multiple1: "𝙔𝙤𝙪",
			multiple2: "𝙔𝙤𝙪 𝙂𝙪𝙮𝙨",
			defaultWelcomeMessage: `✨ 𝘼𝙨𝙨𝙖𝙡𝙖𝙢𝙪𝙖𝙡𝙖𝙞𝙠𝙪𝙢 ✨\n 	 \n~🦋 𝙃𝙚𝙡𝙡𝙤 "{userNameTag}"✨\n~😘𝙒𝙚𝙡𝙘𝙤𝙢𝙚 {multiple} 𝙩𝙤 𝙩𝙝𝙚 𝙘𝙝𝙖𝙩 𝙜𝙧𝙤𝙪𝙥:{boxName} \n~💫𝙒𝙞𝙨𝙝𝙞𝙣𝙜 {multiple} 𝙖 𝙡𝙤𝙫𝙚𝙡𝙮 {session} 😊\n\n~𝙃𝙤𝙥𝙚 𝙮𝙤𝙪 𝙬𝙞𝙡𝙡 𝙛𝙤𝙡𝙡𝙤𝙬 𝙤𝙪𝙧 𝙜𝙧𝙤𝙪𝙥 𝙧𝙪𝙡𝙚𝙨✨💫`
		}
	},

	onStart: async ({ threadsData, message, event, api, getLang }) => {
		if (event.logMessageType == "log:subscribe")
			return async function () {
				const hours = getTime("HH");
				const { threadID } = event;
				const { nickNameBot } = global.GoatBot.config;
				const prefix = global.utils.getPrefix(threadID);
				const dataAddedParticipants = event.logMessageData.addedParticipants;
				// if new member is bot
				if (dataAddedParticipants.some((item) => item.userFbId == api.getCurrentUserID())) {
					if (nickNameBot)
						api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
					return message.send(getLang("welcomeMessage", prefix));
				}
				// if new member:
				if (!global.temp.welcomeEvent[threadID])
					global.temp.welcomeEvent[threadID] = {
						joinTimeout: null,
						dataAddedParticipants: []
					};

				// push new member to array
				global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);
				// if timeout is set, clear it
				clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

				// set new timeout
				global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async function () {
					const threadData = await threadsData.get(threadID);
					if (threadData.settings.sendWelcomeMessage == false)
						return;
					const dataAddedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
					const dataBanned = threadData.data.banned_ban || [];
					const threadName = threadData.threadName;
					const userName = [],
						mentions = [];
					let multiple = false;

					if (dataAddedParticipants.length > 1)
						multiple = true;

					for (const user of dataAddedParticipants) {
						if (dataBanned.some((item) => item.id == user.userFbId))
							continue;
						userName.push(user.fullName);
						mentions.push({
							tag: user.fullName,
							id: user.userFbId
						});
					}
					// {userName}:   name of new member
					// {multiple}:
					// {boxName}:    name of group
					// {threadName}: name of group
					// {session}:    session of day
					if (userName.length == 0) return;
					let { welcomeMessage = getLang("defaultWelcomeMessage") } =
						threadData.data;
					const form = {
						mentions: welcomeMessage.match(/\{userNameTag\}/g) ? mentions : null
					};
					welcomeMessage = welcomeMessage
						.replace(/\{userName\}|\{userNameTag\}/g, userName.join(", "))
						.replace(/\{boxName\}|\{threadName\}/g, threadName)
						.replace(
							/\{multiple\}/g,
							multiple ? getLang("multiple2") : getLang("multiple1")
						)
						.replace(
							/\{session\}/g,
							hours <= 10
								? getLang("session1")
								: hours <= 12
									? getLang("session2")
									: hours <= 18
										? getLang("session3")
										: getLang("session4")
						);

					form.body = welcomeMessage;

					if (threadData.data.welcomeAttachment) {
						const files = threadData.data.welcomeAttachment;
						const attachments = files.reduce((acc, file) => {
							acc.push(drive.getFile(file, "stream"));
							return acc;
						}, []);
						form.attachment = (await Promise.allSettled(attachments))
							.filter(({ status }) => status == "fulfilled")
							.map(({ value }) => value);
					}
					message.send(form);
					delete global.temp.welcomeEvent[threadID];
				}, 1500);
			};
	}
};
