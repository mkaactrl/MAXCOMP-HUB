export default {
    name: "ChatLoggerWithUI",
    description: "Saves chat logs and displays them in a top-right box with a transparent blur background.",
    author: "YourName",
    version: "1.2.0",

    start() {
        this.chatLogs = new Map();
        this.messageCache = new Map();
        this.messageCreateListener = this.handleMessageCreate.bind(this);
        this.messageDeleteListener = this.handleMessageDelete.bind(this);

        const Dispatcher = window.DiscordModules.Dispatcher;
        Dispatcher.subscribe("MESSAGE_CREATE", this.messageCreateListener);
        Dispatcher.subscribe("MESSAGE_DELETE", this.messageDeleteListener);

        this.createUI();

        console.log("ChatLoggerWithUI started!");
    },

    stop() {
        const Dispatcher = window.DiscordModules.Dispatcher;
        Dispatcher.unsubscribe("MESSAGE_CREATE", this.messageCreateListener);
        Dispatcher.unsubscribe("MESSAGE_DELETE", this.messageDeleteListener);

        this.chatLogs.clear();
        this.messageCache.clear();
        this.removeUI();

        console.log("ChatLoggerWithUI stopped!");
    },

    handleMessageCreate(event) {
        const { channelId, message } = event;
        const now = Date.now();

        this.messageCache.set(message.id, { ...message, timestamp: now });

        if (!this.chatLogs.has(channelId)) {
            this.chatLogs.set(channelId, []);
        }

        const logs = this.chatLogs.get(channelId);

        logs.push({
            content: message.content,
            author: message.author.username,
            timestamp: now,
            deleted: false,
        });

        const fiveMinutesAgo = now - 5 * 60 * 1000;
        this.chatLogs.set(
            channelId,
            logs.filter((log) => log.timestamp > fiveMinutesAgo)
        );

        this.updateUI(channelId);
    },

    handleMessageDelete(event) {
        const { id } = event;
        const cachedMessage = this.messageCache.get(id);

        if (cachedMessage) {
            const { channel_id: channelId, content, author } = cachedMessage;

            if (this.chatLogs.has(channelId)) {
                this.chatLogs.get(channelId).push({
                    content: content || "[Unknown content]",
                    author: author.username || "[Unknown user]",
                    timestamp: Date.now(),
                    deleted: true,
                });

                console.log(`Message deleted in channel ${channelId}:`, content || "[Unknown content]");
            }

            this.messageCache.delete(id);
            this.updateUI(channelId);
        }
    },

    createUI() {
        this.logBox = document.createElement("div");
        this.logBox.id = "chat-logger-box";
        this.logBox.style.position = "fixed";
        this.logBox.style.top = "10px";
        this.logBox.style.right = "10px";
        this.logBox.style.width = "300px";
        this.logBox.style.maxHeight = "200px";
        this.logBox.style.overflowY = "auto";
        this.logBox.style.padding = "10px";
        this.logBox.style.background = "rgba(255, 255, 255, 0.8)";
        this.logBox.style.backdropFilter = "blur(10px)";
        this.logBox.style.borderRadius = "8px";
        this.logBox.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
        this.logBox.style.zIndex = "1000";
        this.logBox.style.fontFamily = "Arial, sans-serif";
        this.logBox.style.fontSize = "12px";
        this.logBox.style.color = "#333";
        this.logBox.innerHTML = "<b>Chat Logs:</b><br><small>(Last 5 minutes)</small>";

        document.body.appendChild(this.logBox);
    },

    removeUI() {
        if (this.logBox) {
            this.logBox.remove();
            this.logBox = null;
        }
    },

    updateUI(channelId) {
        if (!this.logBox || !this.chatLogs.has(channelId)) return;

        const logs = this.chatLogs.get(channelId);
        const logItems = logs
            .map((log) => {
                const timestamp = new Date(log.timestamp).toLocaleTimeString();
                const deleted = log.deleted ? " <span style='color: red;'>(Deleted)</span>" : "";
                return `<div><strong>[${timestamp}] ${log.author}:</strong> ${log.content}${deleted}</div>`;
            })
            .join("");

        this.logBox.innerHTML = `<b>Chat Logs:</b><br><small>(Last 5 minutes)</small><br>${logItems}`;
    },
};
