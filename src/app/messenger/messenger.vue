<script>
import chat from './chat.vue';
import composer from './composer.vue';
import client from '../../client';
import * as schema from '../../schema';
import { isSameDate } from '../../lib/datetime';
import { retryTimeout } from '../../lib/timeout';
import ChatContainer from "../components/chat-container.vue";
import ScrollBottom from "../components/scroll-bottom.vue";
import { isYoungerVersion } from "../../lib/version";

export default {
    components: { ScrollBottom, ChatContainer, chat, composer },

    props: {
        mode: String,
        opened: Boolean,
        channel: String,
        replayedMsg: Object,
        scrollToMsg: Object,
        closeSystemChat: Boolean,
        typing: Object,
        rating: Number,
        client: Object,
        enableImgModals: Boolean,
        isMultiple: Boolean,
        appError: Object,
    },

    created() {
        // non-reactive props
        // active channel subscription
        this.subscription = null;

        // active resubscribe timeout (setTimeout result)
        this.subscriptionTimeout = null;

        // resubscribe attempts counter, increased on subscribe error,
        // cleared on first received event
        this.attemptCount = 0;

        // last event id, updated in events handler
        // used in subscribe to channel
        this.lastEventId = null;
        // last generated local message id, to make
        // sure next generated value will be greater
        this.lastLocalId = 0;

    },

    beforeMount() {
        setTimeout(() => {
            this.scrollToLastMessage();
        }, 200);
    },

    mounted() {
        this.loadHistory();
        this.sendGreeting();
    },

    beforeUnmount() {
        this.unsubscribe();
    },

    data: () => {
        return {
            // reactive props
            groups: [],
            searching: false,
            search: "",
            inputMsg: {},
            inputTyping: {},
            systemChat: false,
            singleChoices: [],
            disableFreeText: false,
            badWordError: null,
            shouldBeScrolledBottom: true,
            chatType: 'regular',
            firstUnreadMessageId: 0,
        };
    },

    computed: {
        incomingMessages: function () {
            if (!this.client) return [];
            return this.groups.reduce(
                (result, group) => {
                    result = [...result, ...group.Messages].filter(m => !m.ClientId)
                    return result
                },
                []
            );
        },
        unreadMessages: function () {
            return this.incomingMessages.filter(m => m.Author === "user" && !m.Read);
        },
        unreceivedMessages: function () {
            return this.incomingMessages.filter(m => !m.Received);
        },
        unreadCount: function () {
            return this.unreadMessages.length;
        },
        anonymous: function () {
            return this.client.Type === "anonymous";
        },
        hasPersonalManager() {
            return !!this.client.PersonalManagerId || !!this.client.PersonalManagerGroupId;
        },

    },
    watch: {
        opened: function (newValue, oldValue) {
            // widget opened
            if (newValue && !oldValue) {
                this.markMessagesAsRead();
                this.sendGreeting();
                // Force fixed element to repaint,
                // because of safari issue with fixed hidden elements
                const composer = document.getElementById('composer');
                composer.style.display = 'none';
                setTimeout(() => {
                    composer.style.display = '';
                }, 0);
                this.scrollToLastMessage();
            }
            // widget closed
            if (!newValue) {
                this.firstUnreadMessageId = null;
            }
        },
        search: function (newValue, oldValue) {
            if (!this.searching) {
                this.searching = true;
            }
            this.queryMessages(newValue);
            if (newValue === "" && this.shouldBeScrolledBottom) {
                setTimeout(() => {
                    this.scrollToLastMessage();

                }, 1000)
            }
        },
        unreadCount: function (newValue, oldValue) {
            this.$emit("on-unread-changed", newValue);
        },
        replayedMsg: function (newValue) {
            this.inputMsg = JSON.parse(JSON.stringify(newValue));
        },
        scrollToMsg: function (newValue) {
            this.scrollToPushMessage(newValue)
        },
        rating: function (newRating) {
            if (newRating === 0) {
                this.ignoreRating(0);
            }
        },
        closeSystemChat: function () {
            this.groups = []
        }
    },

    methods: {
        scrollToLastMessage() {
            if (this.firstUnreadMessageId) {
                this.scrollToFoundMessage(this.firstUnreadMessageId);
                return;
            }
            this.scrollToBottom();
        },

        scrollToBottom() {
            const chat = document.getElementById('chat');
            chat.scrollTo({
                top: chat.scrollHeight,
                behavior: 'smooth'
            });

            this.resetUnreadCount();
        },

        scrollWithTimeout() {
          setTimeout(() => {
            const chat = document.getElementById('chat');
            chat.scrollTo({
              top: chat.scrollHeight,
              behavior: 'auto'
            });
          }, 700)

          this.resetUnreadCount();
        },

        resetUnreadCount() {
            this.unreadMessages?.forEach((message) => {
                message.Read = message.Received = true;
                message.ReadAt = message.ReceivedAt = new Date().getTime();
            })
        },

        searchMsg() {
            this.searching = true;
        },

        scrollToFoundMessage(id, block) {
            this.shouldBeScrolledBottom = false;
            this.searching = false;
            client.channelMessages(this.channel, this.chatType, null, id).then(messages => {
                this.appendMessages(messages);
                const msgElement = document.getElementById('message-' + id);
                msgElement.scrollIntoView({
                    behavior: 'smooth',
                    block: block ?? 'center'
                })
                this.shouldBeScrolledBottom = true;
                this.animateMsgAfterScroll(id);
            });
        },
        scrollToPushMessage(msg) {
            document.getElementById('message-' + msg).scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        },

        queryMessages(value) {
            client.channelMessages(this.channel, this.chatType, value).then(messages => {
                this.lastEventId = messages.length
                    ? messages[messages.length - 1].EventId
                    : null;
                this.groups = [];
                this.appendMessages(messages);
            })
        },

        cancelSearch() {
            this.searching = false;
        },

        optionClicked(event) {
            switch (event) {
                case "search":
                    this.searching = true;
                    this.searchMsg();
            }
        },

        handleMenuContext(event) {
            this.$refs.contextMenu.showMenu(event, "search");
        },

        // Public
        appendText(text) {
            if (!text) {
                return;
            }

            this.$refs.composer.appendText(text);
        },

        animateMsgAfterScroll(msgId) {
            this.$refs.chat.animateMsgAfterScroll(msgId);
        },

        // Private

        loadHistory(subscribeNeeded = true) {
            client.channelMessages(this.channel, this.chatType).then(messages => {
                this.lastEventId = messages.length
                    ? messages[messages.length - 1].EventId
                    : null;
                this.groups = [];
                this.appendMessages(messages);
                this.markMessages();
                if (subscribeNeeded) {
                    this.subscribe();
                }
            });
        },

        subscribe() {
            this.unsubscribe();
            this.subscription = client.channelListen(
                this.channel,
                this.chatType,
                this.lastEventId,
                this.onChannelEvents,
                this.onSubscriptionError
            );
        },
        unsubscribe() {
            if (this.subscription) {
                this.subscription.close();
            }
            if (this.subscriptionTimeout) {
                clearTimeout(this.subscriptionTimeout);
            }
        },

        onSubscriptionError(error) {
            this.attemptCount++;
            const timeout = retryTimeout(this.attemptCount);
            console.log(`Subscribe error, retry in ${timeout}ms:`, error);
            this.subscriptionTimeout = setTimeout(this.subscribe, timeout);
        },

        // Messages

        markMessages() {
            if (this.opened) {
                this.markMessagesAsRead();
            } else {
                this.markMessagesAsReceived();
            }
        },

        markMessagesAsReceived() {
            const ids = [];
            for (let message of this.unreceivedMessages) {
                ids.push(message.Id);
                message.Received = true;
                message.ReceivedAt = new Date().getTime();
            }
            if (ids.length) {
                client.channelMessagesReceived(ids);
            }
        },

        markMessagesAsRead() {
            const ids = this.unreadMessages.map(({ Id }) => Id);
            if (ids.length) {
                client.channelMessagesRead(ids);
            }
        },

        appendMessages(messages) {
            if (messages.length > 0) {
                const last = messages[messages.length - 1];
                if (last.DisableFreeText) {
                    this.disableFreeText = true;
                } else {
                    this.disableFreeText = false;
                }
            }

            for (let message of messages) {
                this.appendMessage(message);
            }
            this.maybeEnableFreeText();
        },

        appendMessage(message) {
            if (message.Id) {
                for (let group of this.groups) {
                    for (let m of group.Messages) {
                        if (m.Id === message.Id) {
                            return;
                        }
                    }
                }
            }
            this.messageGroupsAppend(this.groups, message);
        },

        appendLocalMessage(messageForm) {
            const message = Object.assign({}, messageForm, {
                Client: this.client,
                ClientId: this.client.Id,
                Author: "client",
                CreatedAt: new Date(),
                ReplyToMessageId: messageForm.ReplyToMessageId
            });
            this.firstUnreadMessageId = null;
            this.appendMessage(message, true);
            return message;
        },

        replaceMessage(message) {
            if (this.messageGroupsReplace(this.groups, message)) {
                this.groups.push({}); // FIX: have to use to simulate object change,
                this.groups.pop(); // because i couldn't find way to fire deep object changes
                return true;
            }
            return false;
        },

        removeMessage(message) {
            if (this.messageGroupsRemove(this.groups, message)) {
                this.groups.push({}); // FIX: have to use to simulate object change,
                this.groups.pop(); // because i couldn't find way to fire deep object changes
                return true;
            }
            return false;
        },

        getMessageByLocalId(localId) {
            for (let g = this.groups.length - 1; g >= 0; g--) {
                for (let i = this.groups[g].Messages.length - 1; i >= 0; i--) {
                    const message = this.groups[g].Messages[i];
                    if (message.LocalId === localId) {
                        return message;
                    }
                }
            }
            return null;
        },

        getMessageById(id) {
            for (let g = this.groups.length - 1; g >= 0; g--) {
                for (let i = this.groups[g].Messages.length - 1; i >= 0; i--) {
                    const message = this.groups[g].Messages[i];
                    if (message.Id && message.Id === id) {
                        return message;
                    }
                }
            }
            return null;
        },

        messageGroupsReplace(groups, message) {
            for (let g = groups.length - 1; g >= 0; g--) {
                const group = groups[g];
                for (let i = groups[g].Messages.length - 1; i >= 0; i--) {
                    const msg = group.Messages[i];
                    if (
                        (msg.Id && msg.Id === message.Id) ||
                        msg.LocalId === message.LocalId
                    ) {
                        group.Messages[i] = { ...message };

                        if (i === group.Messages.length - 1) {
                            group.LastMessage = message;
                            this.singleChoices = group.LastMessage.SingleChoices
                            if (group.LastMessage.DisableFreeText) {
                                this.disableFreeText = true
                            } else {
                                this.disableFreeText = false
                            }
                            this.maybeEnableFreeText();
                        }
                        return true;
                    }
                }
            }
            return false;
        },

        messageGroupsRemove(groups, message) {
            for (let g = groups.length - 1; g >= 0; g--) {
                const group = groups[g];
                for (let i = group.Messages.length - 1; i >= 0; i--) {
                    const msg = group.Messages[i];
                    if (
                        (msg.Id && msg.Id === message.Id) ||
                        msg.LocalId === message.LocalId
                    ) {
                        group.Messages.splice(i, 1);
                        if (group.Messages.length === 0) {
                            groups.splice(g, 1);
                        } else {
                            group.LastMessage = group.Messages[group.Messages.length - 1];
                            this.singleChoices = group.Messages[group.Messages.length - 1].SingleChoices;
                            if (group.LastMessage.DisableFreeText) {
                                this.disableFreeText = true
                            } else {
                                this.disableFreeText = false
                            }
                            this.maybeEnableFreeText();
                        }
                        return true;
                    }
                }
            }
            return false;
        },

        messageGroupsAppend(groups, message) {
            if (groups.length > 0) {
                const group = groups[groups.length - 1];
                const lastMessage = group.Messages[group.Messages.length - 1];
                if (
                    group.Author === message.Author &&
                    group.UserId === message.UserId &&
                    group.ClientId === message.ClientId &&
                    message.CreatedAt - lastMessage.CreatedAt < 60000 &&
                    isSameDate(message.CreatedAt, lastMessage.CreatedAt)
                ) {

                    if (!message.Read && message.Author === 'user'
                        && !this.opened
                        && (!this.firstUnreadMessageId || this.firstUnreadMessageId > message.Id)) {
                        this.firstUnreadMessageId = message.Id;
                    }
                    if (message.My && message.Id > this.firstUnreadMessageId) {
                        this.firstUnreadMessageId = null;
                    }
                    group.Messages.push(message);

                    group.LastMessage = message;
                    this.singleChoices = group.LastMessage.SingleChoices
                    this.disableFreeText = group.LastMessage.DisableFreeText

                    if (message.InfoRequest && message.InfoRequest.State !== 'finished') {
                        group.InfoRequest = message.InfoRequest;
                    }

                    if (message.Rating) {
                        group.Rating = message.Rating;
                    }
                    this.maybeEnableFreeText();
                    return;
                }
            }

            const isNewDay =
                groups.length > 0
                    ? !isSameDate(
                        message.CreatedAt,
                        groups[groups.length - 1].LastMessage.CreatedAt
                    )
                    : true;

            const group = {
                Id: groups.length + 1,
                Author: message.Author,
                UserId: message.UserId,
                ClientId: message.ClientId,

                User: message.User,
                Client: message.Client,

                Messages: [message],
                LastMessage: message,
                Rating: message.Rating,

                IsNewDay: isNewDay
            };

            if (message.InfoRequest && message.InfoRequest.State !== 'finished') {
                group.InfoRequest = message.InfoRequest;
            }
            groups.push(group);
            this.maybeEnableFreeText();
        },

        sendGreeting() {
            if (this.systemChat === true) {
                return;
            }
            if (this.groups[this.groups.length - 1] && !this.groups[this.groups.length - 1]) {
                const lastGroup = this.groups[this.groups.length - 1]
                if (lastGroup.Rating && !lastGroup.LastMessage.RatingId) {
                    return;
                }
            }
            client.getChatSettings(this.channel).then(result => {
                const settings = result.Data
                if (settings !== null) {
                    this.systemChat = true
                    // if client has no open tickets, send him greeting from bot or from made-up operator
                    // these messages are deleted if client does not respond
                    client.listTicketsByClient(this.channel, this.client.Id, { Open: true }).then(result => {
                        if (result.Data.TotalCount === 0) {
                            if (settings.GreetFrom === 'bot') {
                                client.openSystemChat(this.channel)
                                this.scrollToLastMessage();
                            } else {
                                const message = {
                                    Id: new Date().getTime(),
                                    Author: "user",
                                    CreatedAt: new Date(),
                                    Text: settings.Message,
                                    Payload: 'text',
                                    Read: true,
                                    UserId: new Date().getTime(),
                                    User: {
                                        DisplayName: settings.OperatorName,
                                        Name: settings.OperatorName,
                                        Active: true,
                                        Id: new Date().getTime()
                                    }
                                };
                                this.appendMessage(message)
                                setTimeout(() => {
                                    this.removeMessage(message);
                                    this.systemChat = false
                                }, 1000 * settings.Lifetime)
                            }
                        } else {
                            this.systemChat = false;
                        }
                    })
                }
            })
        },

        maybeEnableFreeText() {
            if (!this.groups.length ||
                !this.groups[this.groups.length - 1].LastMessage.DisableFreeText) {
                this.disableFreeText = false;
            }
        },

        getNextLocalId() {
            let localId = new Date().getTime();
            if (localId <= this.lastLocalId) {
                localId = this.lastLocalId + 1;
            }
            this.lastLocalId = localId;
            return localId;
        },

        newTextMessage(text, botpressPayload) {
            const msg = {
                LocalId: this.getNextLocalId(),
                Payload: schema.ChatPayloadText,
                Text: text,
                BotpressPayload: botpressPayload,
                ChatType: this.chatType
            };
            if (this.disableFreeText) {
                msg.DisableFreeText = true;
            }
            return msg;
        },

        newTextMessageWithReply(text, id) {
            const msg = {
                LocalId: this.getNextLocalId(),
                Payload: schema.ChatPayloadText,
                Text: text,
                ReplyToMessageId: id,
                ChatType: this.chatType
            }
            if (this.disableFreeText) {
                msg.DisableFreeText = true;
            }
            return msg;
        },

        newFileMessage(file, text) {
            return {
                LocalId: this.getNextLocalId(),
                Payload: schema.ChatPayloadFile,
                Text: text,
                Upload: file,
                ChatType: this.chatType
            };
        },

        newFileMessageWithReply(file, id, text) {
            return {
                LocalId: this.getNextLocalId(),
                Payload: schema.ChatPayloadFile,
                Text: text,
                Upload: file,
                ReplyToMessageId: id,
                ChatType: this.chatType
            };
        },

        uploadMessage(message) {
            message.UploadError = null;
            message.UploadProgress = 0;
            message.Uploading = client.uploadFile(
                message.Upload,
                file => {
                    message.Upload = undefined;
                    message.UploadError = undefined;
                    message.UploadProgress = undefined;
                    message.Uploading = undefined;
                    message.File = file;
                    message.FileId = file.Id;
                    client.channelSend(this.channel, message);
                    this.replaceMessage(message);
                    this.scrollToLastMessage();
                },
                error => {
                    message.UploadError = error.http() ? "Ошибка загрузки" : error.text;
                    message.UploadProgress = undefined;
                    message.Uploading = undefined;
                    this.replaceMessage(message);
                },
                progress => {
                    message.UploadProgress = progress;
                    this.replaceMessage(message);
                }
            );
        },

        cancelUpload(localId) {
            const message = this.getMessageByLocalId(localId);
            if (!message) {
                return;
            }
            if (!message.Upload) {
                return;
            }
            if (message.Uploading) {
                message.Uploading.abort();
            }
            this.removeMessage(message);
        },

        retryUpload(localId) {
            const message = this.getMessageByLocalId(localId);
            if (!message) {
                return;
            }
            this.uploadMessage(message);
        },

        // Ratings

        rateRating(rating) {
            if (rating.Sending) {
                return;
            }

            rating.Sending = client
                .rateRating(rating.Id, rating.Value, rating.Comment)
                .then(
                    rated => {
                        rating.Sending = null;
                        rating.State = rated.State;
                        rating.Value = rated.Value;
                        rating.Comment = rated.Comment;
                    },
                    error => {
                        rating.Sending = null;
                        rating.Value = 0;
                    }
                );
        },

        ignoreRating(rating) {
            if (rating.Sending) {
                return;
            }

            rating.Sending = client.ignoreRating(rating.Id).then(
                ignored => {
                    rating.Sending = null;
                    rating.State = ignored.State;
                    rating.Value = 0;
                },
                error => {
                    rating.Sending = null;
                    rating.Value = 0;
                }
            );
        },

        mobileRating(rating) {
            this.$emit("on-rating", rating);
        },


        sendInfo(info) {
            if (info.Sending) {
                return;
            }
            let clientName = this.client.Name
            let firstName = '';
            let middleName = '';
            let lastName = '';
            for (let f of info.Form.Fields) {
                if (f.Name === 'Имя' && f.CorrespondingField !== '') {
                    firstName = f.CorrespondingField;
                }
                if (f.Name === 'Отчество' && f.CorrespondingField !== '') {
                    middleName += f.CorrespondingField;
                }
                if (f.Name === 'Фамилия' && f.CorrespondingField !== '') {
                    lastName += f.CorrespondingField;
                }
            }
            if (firstName !== '') {
                clientName = firstName
            }
            if (middleName !== '') {
                clientName += ' ' + middleName
            }
            if (lastName !== '') {
                clientName += ' ' + lastName
            }
            if (firstName !== '') {
                this.client.Name = clientName;
            }
            info.Sending = client
                .sendInfo(info)
                .then(
                    rated => {
                        info.Sending = null;
                        info.State = 'finished';
                    },
                    error => {
                        info.Sending = null;
                        info.Error = error;
                    }
                );
        },

        ignoreInfo(info) {
            if (info.Sending) {
                return;
            }

            info.Sending = client.ignoreInfo(info.Id).then(
                ignored => {
                    info.Sending = null;
                    info.State = ignored.State;
                },
                error => {
                    info.Sending = null;
                    info.Error = error;
                }
            );
        },

        downloadFile(file) {
            client.fileSignedUrl(file.Id).then(
                url => {
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = file.Name;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                },
                error => {
                    console.log(error);
                }
            );
        },

        clickFile(file) {
            if (file.Id) {
                client.fileSignedUrl(file.Id).then(
                    url => {
                        this.$emit("on-file-clicked", url);
                    },
                    error => {
                        console.log(error);
                    }
                );
            } else {
                this.$emit("on-file-clicked", file);
            }

        },

        longTap(msg) {
            this.$emit("on-longtap", msg);
        },

        reply(msg) {
            this.inputMsg = JSON.parse(JSON.stringify(msg));
        },

        // Handlers

        onCloseClicked() {
            this.$emit("on-close");
        },

        onLogoutClicked() {
            this.$emit("on-logout");
        },

        onChatTypeSelected(event) {
            this.chatType = event.target.value;
            this.loadHistory();
        },

        onChannelEvents(events) {
            // Clear subscribe attempts count,
            // this is the only way to know that we successfully
            // subscribed to channel events
            this.attemptCount = 0;

            // Will be set to true if at least one
            // event is new message and it really added
            // to messages list, used to trigger on message event
            // and mark received images only once
            let messagesReceived = false;

            for (let event of events) {
                switch (event.Type) {
                    case schema.ChatEventMessageCreated:
                        if (this.handleIncomingMessage(event.Message)) {
                            messagesReceived = true;
                        }
                        break;
                    case schema.ChatEventMessageRead:
                        this.handleIncomingRead(event);
                        break;
                    case schema.ChatEventMessageListened:
                        this.handleIncomingListened(event);
                        break;
                    case schema.ChatEventMessageEdited:
                        event.Messages.forEach(msg => this.handleIncomingEdited(msg));
                        break;
                    case schema.ChatEventMessageReceived:
                        this.handleIncomingReceived(event);
                        break;
                    case schema.ChatEventTyping:
                        this.handleOperatorTyping(event);
                        break;
                    case schema.ChatEventCloseSystemChat:
                        event.Messages.forEach(msg => this.removeMessage(msg))
                        this.systemChat = false
                        break;
                    case schema.ChatEventChatClosed:
                        this.systemChat = false;
                        break;
                    case schema.ChatEventMessagesDeleted:
                        event.Messages.forEach(msg => this.removeMessage(msg))
                        break;
                    case schema.ChatEventFileUpdated:
                        this.handleIncomingUpdatedFile(event);
                        break;
                    case schema.ChatEventClientChanged:
                        this.$emit("client-changed", event)
                        break;
                    default:
                        console.log("Unhandled channel event", event);
                }
                this.lastEventId = event.Id;
            }

            if (messagesReceived) {
                this.$emit("on-message-received");
                this.markMessages();
            }
        },

        /**
         * Add or replaces message in messages list
         * Returns true if message really added.
         * @param message
         * @returns {boolean}
         */
        handleIncomingMessage(message) {
            // Empty message
            if (!message) {
                return false;
            }
            // Someone else's message
            if (!message.My) {
                this.appendMessage(message);
                this.scrollWithTimeout();
                return true;
            }
            this.scrollToFoundMessage(this.firstUnreadMessageId ?? message.Id);
            // Replace my own message
            if (!this.replaceMessage(message)) {
                // Sent from concurrent session from another browser?
                this.appendMessage(message);
            }
            return false;
        },

        handleIncomingRead(event) {
            const message = this.getMessageById(event.MessageId);
            if (!message) {
                return;
            }
            message.Read = message.Received = true;
            message.ReadAt = message.ReceivedAt = event.CreatedAt;
            this.replaceMessage(message);
        },

        handleIncomingListened(event) {
            const message = this.getMessageById(event.MessageId);
            if (!message) {
                return;
            }
            message.Listened = message.Received = true;
            message.ListenedAt = message.ReceivedAt = event.CreatedAt;
            this.replaceMessage(message);
        },

        handleIncomingEdited(message) {
            this.replaceMessage(message);
        },

        handleIncomingReceived(event) {
            const message = this.getMessageById(event.MessageId);
            if (!message) {
                return;
            }
            message.Received = true;
            message.ReceivedAt = event.CreatedAt;
            this.replaceMessage(message);
        },

        handleOperatorTyping(event) {
            this.inputTyping = JSON.parse(JSON.stringify(event));
        },

        handleIncomingUpdatedFile(event) {
            const message = this.getMessageById(event.MessageId);
            if (!message) {
                return;
            }
            client.getFile(message.FileId).then(file => {
                message.File.State = file.State;
                this.replaceMessage(message);
            })
        },

        onMessageComposed(text, botpressPayload, url) {
            if (url) {
                window.open(url, '_blank').focus();
                return;
            }
            if (text.messageText === "/version") {
                this.handleVersion();
                return;
            }

            if (this.badWordError) {
                this.badWordError = null;
            }
            if (isYoungerVersion("4.2.1", client.iQVersion)) {
                client.checkMessage(text.messageText).then(ok => {
                    this.sendMsg(text, botpressPayload)
                }, err => {
                    if (err.code === "http") {
                        this.sendMsg(text, botpressPayload)
                    } else {
                        this.badWordError = err;
                    }
                })
            } else {
                this.sendMsg(text, botpressPayload);
            }
        },

        sendMsg(text, botpressPayload) {
            let messageForm
            if (typeof text !== 'object') {
                messageForm = this.newTextMessage(text, botpressPayload);
            } else {
                messageForm = this.newTextMessageWithReply(text.messageText, text.replyToMessageId, botpressPayload);
            }
            this.appendLocalMessage(messageForm);

            client.channelSend(this.channel, messageForm).then(() =>

                this.loadHistory(false));
        },

        handleVersion() {
            client.version().then(res => {
                const v = res.Data.Version;
                const message = {
                    Id: new Date().getTime(),
                    Author: "user",
                    CreatedAt: new Date(),
                    Text: v,
                    Payload: 'text',
                    Read: true,
                    UserId: new Date().getTime(),
                    User: { DisplayName: "Система", Name: "Система", Active: true, Id: new Date().getTime() }
                };
                this.appendMessage(message);
                this.scrollToLastMessage();
            })
        },

        onStartTyping(text) {
            client.channelTyping(this.channel, this.chatType, text).catch(() => {
                // ignore error, cause event is transitive
            });
        },

        onFileSelected(files, text, id) {
            let messageForm;
            for (const file of files) {
                if (id) {
                    messageForm = this.newFileMessageWithReply(file, id, file === files[files.length - 1] ? text : "");
                } else {
                    messageForm = this.newFileMessage(file, file === files[files.length - 1] ? text : "");
                }
                const message = this.appendLocalMessage(messageForm);
                this.uploadMessage(message);
            }
        },

    }
};
</script>

<template lang="pug">
    .messenger(:class="{ 'messenger_absolute': !isMultiple }")
        .header#header-loading(v-if="appError")
            .messenger-loading
                fade-loader.loader(:height="'6px'" :width="'2px'" :radius="'7px'" :color="'#b9b9b9'")
                p Ожидание сети...
        .header#header(v-else)
            .content#header-content(v-if="!isMultiple")
                div.client-name-container(v-if="mode !== 'mobile'")
                    p {{ client.Name }}
                    p(v-if="anonymous")
                        a.logout(href="#" @click.prevent="onLogoutClicked") удалить переписку
                    a.close(href="#" @click.prevent="onCloseClicked" title="Закрыть переписку")
                        font-awesome-icon(:icon="['fa', 'fa-times']")
                div(style="display:flex")
                    span.fa-icon.search-icon(title="Поиск по чату", @click.prevent="searchMsg()")
                        font-awesome-icon(:icon="['fas', 'fa-search']")
                    div.chat-type-container(v-if="searching || !hasPersonalManager", style="display:flex; width:100%" )
                        input.search-input(type="text" placeholder="Введите текст сообщения", v-model="search")
                        span.fa-icon(v-if="hasPersonalManager" title="Отменить", @click.prevent="cancelSearch()")
                            font-awesome-icon(:icon="['fas', 'fa-times']")
                    div.chat-type-container(v-if="hasPersonalManager && !searching")
                        select(name="chat-type" @change="onChatTypeSelected").chat-type-select
                            option(selected value="regular") Общий чат
                            option(value="personal_manager") Чат с персональным менеджером

            .content(v-if="isMultiple")
                .nav-container#header-multiple-content(v-if="isMultiple && !searching")
                    .nav-item
                        span.fa-icon.back-icon(@click.prevent="() => $emit('on-back')")
                            font-awesome-icon(:icon="['fas', 'fa-arrow-left']")
                    .nav-item.w-100
                        chat-container(:chat="client", :chat-name="channel" :is-with-personal-manager="chatType === 'personal_manager'")
                    .nav-item.fa-icon.options-icon(v-wave, @click.prevent.stop="handleMenuContext($event)")
                        font-awesome-icon(:icon="['fas', 'fa-ellipsis-vertical']")

                .nav-container#header-multiple-content_search(v-if="searching")
                    .nav-item
                        span.fa-icon(title="Отменить", @click.prevent="cancelSearch()")
                            font-awesome-icon(:icon="['fas', 'fa-times']")
                    .nav-item.w-100
                        div(v-if="searching || !hasPersonalManager", style="width:80%" )
                            input.search-input(type="text" placeholder="Введите текст сообщения", v-model="search")


        #chat
            chat(
                ref="chat",
                :mode="mode",
                :opened="opened",
                :groups="groups",
                :rating="rating",
                :client="client",
                :channel="channel",
                :singleChoices="singleChoices",
                :searching="searching",
                :enableImgModals="enableImgModals",
                :firstUnreadMessageId="firstUnreadMessageId",
                @cancel-upload="cancelUpload",
                @retry-upload="retryUpload",
                @rate-rating="rateRating",
                @message-composed="onMessageComposed",
                @ignore-rating="ignoreRating",
                @mobile-rating="mobileRating",
                @send-info="sendInfo",
                @ignore-info="ignoreInfo",
                @long-tap="longTap",
                @reply-msg="reply",
                @scrollToMessage="(id) => scrollToFoundMessage(id)",
                @click-file="clickFile",
                @download-file="downloadFile",
            )
            .div#single-choices(v-if="groups.length && groups[groups.length -1].LastMessage.SingleChoices !== null")
                div.choice_box(v-if="groups[groups.length -1].LastMessage.IsDropDown")
                    button.choice_button(type="button",
                        v-for="choice in groups[groups.length -1].LastMessage.SingleChoices",
                        @click.prevent="onMessageComposed(choice.title, choice.value, null)") {{ choice.title }}
        .unacceptable-msg(v-if="badWordError")
            p(v-text="badWordError")
        #composer
            composer(
                ref="composer"
                :replayedMsg="inputMsg"
                :operatorTyping="inputTyping"
                :disableFreeText="disableFreeText"
                @message-composed="onMessageComposed"
                @file-selected="onFileSelected"
                @start-typing="onStartTyping"
                :channel="this.channel"
            )

    scroll-bottom(@on-click="scrollToBottom", @on-reached-bottom="resetUnreadCount", :unreadCount="unreadCount")

    v-context(
        element-id="nav-context",
        :options="[{name: 'Поиск', class: 'context-menu-option'}]",
        ref="contextMenu",
        @option-clicked="optionClicked",
    )
</template>

<style lang="scss">
.header {
    width: 100%;
    background-color: #f0f0f0;
    text-align: center;
    display: flex;

    .content {
        display: table-cell;
        vertical-align: middle;
        text-align: center;
        flex: 1;

        .client-name-container {
            display: block;
        }

        p {
            margin-bottom: 8px;
        }
    }
}

a.close,
a.close:active,
a.close:visited,
a.close:focus {
    position: absolute;
    padding: 1em 0.8em 1em 0.8em;
    right: 0;
    top: 0;
    color: #666666;
}

a.logout,
a.logout:active,
a.logout:visited,
a.logout:focus {
    color: #666666;
    text-decoration: none;
    font-size: 75%;
    border-bottom: 1px dashed #666666;
    margin-top: 8px;
    margin-bottom: 8px;
}

#chat {
    width: 100%;
    background-color: white;
    overflow-y: scroll;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    flex: 1;
}

#composer {
    background: #fff;
}

.messenger {
    height: 100%;
    overflow-y: clip;
    display: flex;
    flex-direction: column;
}

.messenger_absolute {
    position: absolute;
    right: 0;
    left: 0;
}

.chat-type-container {
    padding: 8px;
    width: 100%;
}

.chat-type-select {
    width: 100%;
    color: inherit;
    background-color: inherit;
    border-radius: 0.25rem;
    border: 1px solid #ced4da;
    padding: .375rem 2.25rem .375rem .75rem;
}

.choice_box {
    float: right;
    margin-top: 5px;
    line-height: 1.15;
    text-transform: none;
    visibility: visible;
    -webkit-box-direction: normal;
    text-align: right;
    font-size: 14px;
    border-radius: 3px;
}

.choice_button {
    white-space: pre-wrap;
    /* css-3 */
    white-space: -moz-pre-wrap;
    /* Mozilla, since 1999 */
    white-space: -pre-wrap;
    /* Opera 4-6 */
    white-space: -o-pre-wrap;
    /* Opera 7 */
    word-wrap: break-word;
    /* Internet Explorer 5.5+ */
    font-family: inherit;
    font-size: inherit;
    text-align: right;
    width: fit-content;
    border: 1px solid #A3DE62;
    margin-bottom: 5px;
    border-radius: 10px;
    background: none;
    color: #74B928;
    height: 36px;
    margin-right: 6px;
    cursor: pointer;
    transition: border 0.3s, background 0.3s, color 0.3s;
}

.fa-icon {
    margin-left: 5px;
    padding: 5px;
    cursor: pointer;
}

.search-icon {
    font-size: 20px;
    display: flex;
    align-items: center;
}

.back-icon,
.options-icon {
    font-size: 22px;
}

.options-icon {
    border-radius: 100%;
    width: 35px;
}

.w-100 {
    width: 100%;
}

.search-input {
    width: 100%;
    color: gray;
    background-color: #FFFFFF;
    border-radius: 0.25rem;
    border: 1px solid #ced4da;
    padding: .375rem 3rem .375rem .75rem;

    &:focus {
        outline: none;
    }
}

.nav-container {
    display: flex;
    padding: 15px 5px;
    align-items: center;
    min-height: 35px;
}

.nav-item {
    margin-right: 8px;
}

.vue-simple-context-menu .context-menu-option {
    transition: 0.1s ease;

    &:hover {
        background-color: #dedede;
        color: black;
    }
}

.unacceptable-msg {
    text-align: center;
    margin-right: 10px;
    color: #ba6161;
    font-size: 12px;
    background-color: white;
}

.messenger-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    .loader {
        height: 24px;
        width: 24px;
        top: 6px;
    }
}
</style>
