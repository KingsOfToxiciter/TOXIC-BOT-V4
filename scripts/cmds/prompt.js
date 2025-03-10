const axios = require('axios');
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
    const dip = event.messageReply?.attachments[0]?.url || args.join(' ');
    if (!dip) {
      return api.sendMessage('Please reply to an image.', event.threadID, event.messageID);
    }
    try {
      const prom = (await axios.get(`https://www.noobz-api.rf.gd/api/prompt?url=${encodeURIComponent(dip)}`));

const hasan = prom.data;
         api.sendMessage(hasan, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      return api.sendMessage('Failed to convert image into text.', event.threadID, event.messageID);
    }
  };
