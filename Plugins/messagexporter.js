import { commands } from "@vendetta/commands";
import { getMessages } from "@vendetta/api";
import { writeFile } from "@vendetta/storage";

// Command registration
commands.register({
  name: "xpdm",
  description: "Export DM chat logs to .txt",
  execute: async () => {
    try {
      const channelId = /* Get current channel ID dynamically */;
      const messages = await fetchMessages(channelId, 1782);
      
      // Format messages
      const log = messages.map(msg => `[${new Date(msg.timestamp).toLocaleString()}] ${msg.author.username}: ${msg.content}`).join("\n");
      
      // File path in Downloads folder
      const fileName = `DM_Log_${Date.now()}.txt`;
      const filePath = `/storage/emulated/0/Download/${fileName}`;
      
      // Save to file
      writeFile(filePath, log);
      
      // Notify user
      return `Exported DM log to Downloads folder as ${fileName}`;
    } catch (error) {
      console.error("Error exporting messages:", error);
      return `Failed to export messages: ${error.message}`;
    }
  }
});

// Fetch messages function
async function fetchMessages(channelId, limit) {
  const fetchedMessages = [];
  let before = null;

  while (fetchedMessages.length < limit) {
    const batch = await getMessages(channelId, { limit: 100, before });
    if (!batch || batch.length === 0) break;

    fetchedMessages.push(...batch);
    before = batch[batch.length - 1].id;
  }

  return fetchedMessages.slice(0, limit);
}
