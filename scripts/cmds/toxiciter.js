module.exports = {
 config: {
	 name: "toxiciter",
	 version: "1.0",
	 author: "Hasan",//remodified by cliff
	 countDown: 5,
	 role: 0,
	 shortDescription: "no prefix",
	 longDescription: "no prefix",
	 category: "auto 🪐",
 },

 onStart: async function(){}, 
 onChat: async function({ event, message, getLang }) {
 if (event.body && event.body.toLowerCase() === "toxiciter") {
 return message.reply({
 body: `
◈ ★彡[ᴀꜱꜱᴀʟᴀᴍᴜᴀʟᴀɪᴋᴜᴍ!]彡★
 ~  ʜᴇʟʟᴏ ᴀᴍɪ 🎭𝘛ₒₓᵢ𝚌ᵢ𝚝ₑᵣ⭕ 
 ~  ʜᴏᴡ ᴄᴀɴ ɪ ᴀꜱꜱɪꜱᴛ ʏᴏᴜ?!
 ~  ᴍʏ ᴏᴡɴᴇʀ ɪꜱ ★彡[ʜᴀꜱᴀɴ ᴍᴀʜᴍᴜᴅ]彡★
 ◈  ɴᴇᴇᴅ ʜᴇʟᴘ ᴛᴏ ɪɴʙᴏx ʜɪᴍ  ◈
 ~  ᴏᴡɴᴇʀ : https://www.facebook.com/Itz.HaSaN.00`
 });
 }
 }
}
