const axios = require('axios');

async function baigan() {
   try {
      const toxic = await axios.get(`https://raw.githubusercontent.com/KingsOfToxiciter/API/refs/heads/main/hasan.json`);
    return toxic.data.hasan;
} catch (error) {
      console.error("failed to fetch", error.message);
   }
}

module.exports.config ={
    name: "prompt",
    version: "1.0",
    author: "♡︎ 𝐻𝐴𝑆𝐴𝑁 ♡︎",
    countDown: 5,
    role: 0,
    category: "media",
    description: " image to prompt",
    category: "tools",
    usages: "reply [image]"
  },

module.exports.onStart = async ({ api, event,args }) =>{
    const q = event.messageReply?.attachments[0]?.url || args.join(' ');
    if (!dip) {
      return api.sendMessage('Please reply to an image.', event.threadID, event.messageID);
    }
    try {
      
      const api = await baigan();
      const prompt = (await axios.get(`${api}/prompt?url=${encodeURIComponent(q)}`));

const hasan = prompt.data;
         api.sendMessage(hasan, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      return api.sendMessage('Failed to convert image into text.', event.threadID, event.messageID);
    }
  };
