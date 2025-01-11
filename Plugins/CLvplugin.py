export default {
    name: "ChatLogger",
    description: "Saves chat logs for the last 5 minutes in the current channel or group, including deleted messages.",
    author: "YourName",
    version: "1.1.0",

    start() {
        this.chatLogs = new Map(); // Stores messages per channel
        this.messageCache = new Map(); // Caches messages by ID
        this.messageCreateListener = this.handleMessageCreate.bind(this);
        this.messageDeleteListener = this.handleMessageDelete.bind(this);

        const Dispatcher = window.DiscordModules.Dispatcher;

        // Subscribe to message events
        Dispatcher.subscribe("MESSAGE_CREATE", this.messageCreateListener);
        Dispatcher.subscribe("MESSAGE_DELETE", this.messageDeleteListener);

        console.log("ChatLogger started!");
    },

    stop() {
        const Dispatcher = window.DiscordModules.Dispatcher;

        // Unsubscribe from message events
        Dispatcher.unsubscribe("MESSAGE_CREATE", this.messageCreateListener);
        Dispatcher.unsubscribe("MESSAGE_DELETE", this.messageDeleteListener);

        // Clear stored data
        this.chatLogs.clear();
        this.messageCache.clear();

        console.log("ChatLogger stopped!");
    },

    handleMessageCreate(event) {
        const { channelId, message } = event;
        const now = Date.now();

        // Cache the message for potential deletion tracking
        this.messageCache.set(message.id, { ...message, timestamp: now });

        // Initialize or update the chat log for the channel
        if (!this.chatLogs.has(channelId)) {
            this.chatLogs.set(channelId, []);
        }

        const logs = this.chatLogs.get(channelId);

        // Add the new message with its timestamp
        logs.push({
            content: message.content,
            author: message.author.username,
            timestamp: now,
            deleted: false, // Message is not deleted
        });

        // Remove messages older than 5 minutes
        const fiveMinutesAgo = now - 5 * 60 * 1000;
        this.chatLogs.set(
            channelId,
            logs.filter((log) => log.timestamp > fiveMinutesAgo)
        );

        console.log(`Message logged in channel ${channelId}:`, message.content);
    },

    handleMessageDelete(event) {
        const { id } = event; // Message ID
        const cachedMessage = this.messageCache.get(id);

        if (cachedMessage) {
            const { channel_id: channelId, content, author } = cachedMessage;

            // Add a log entry for the deleted message
            if (this.chatLogs.has(channelId)) {
                this.chatLogs.get(channelId).push({
                    content: content || "[Unknown content]",
                    author: author.username || "[Unknown user]",
                    timestamp: Date.now(),
                    deleted: true, // Mark message as deleted
                });

                console.log(
                    `Message deleted in channel ${channelId}:`,
                    content || "[Unknown content]"
                );
            }

            // Clean up the cache for this message
            this.messageCache.delete(id);
        }
    },

    getLogs(channelId) {
        // Retrieve logs for the current channel
        return this.chatLogs.get(channelId) || [];
    },
};
