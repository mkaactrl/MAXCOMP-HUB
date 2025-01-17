const fs = require('fs');
const path = require('path');

registerCommand({
  name: "xpdm",
  description: "Export DM chat logs to .txt",
  execute: async (args, context) => {
    try {
      const messages = await fetchMessages(context.channelId, 1782);
      const log = messages.map(msg => `[${msg.timestamp}] ${msg.author}: ${msg.content}`).join('\n');
      
      const filePath = path.join(android.os.Environment.getExternalStorageDirectory().getPath(), "Download", `DM_Log_${Date.now()}.txt`);
      fs.writeFileSync(filePath, log, 'utf8');
      
      context.reply(`Chat log saved to Downloads folder as DM_Log_${Date.now()}.txt`);
    } catch (error) {
      context.reply("Error exporting messages: " + error.message);
    }
  }
});

async function fetchMessages(channelId, limit) {
  let fetchedMessages = [];
  let lastMessageId = null;

  while (fetchedMessages.length < limit) {
    const batch = await fetch(`/channels/${channelId}/messages?limit=100&before=${lastMessageId}`);
    fetchedMessages = fetchedMessages.concat(batch);
    if (batch.length < 100) break;
    lastMessageId = batch[batch.length - 1].id;
  }

  return fetchedMessages.slice(0, limit);
}
