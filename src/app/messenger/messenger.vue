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
import config from "../../config";

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

    mounted() {
        this.loadHistory();
        this.sendGreeting();
        this.initScrollEvents();
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
            chatType: 'regular',
            firstUnreadMessageId: 0,
            currentLimit: config.REQUEST_MESSAGES_LIMIT,
            loadingMore: false,
            existingMsgIds: {},
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

                // Force fixed element to rerender,
                // because of safari issue with fixed hidden elements
                const composer = document.getElementById('composer');
                composer.style.display = 'none';
                setTimeout(() => {
                    composer.style.display = '';
                    this.scrollToBottom();
                }, 0);

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
            if (newValue === "") {
                setTimeout(() => {
                    this.scrollToMessage();
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
            this.scrollToMessage(newValue)
        },
        rating: function (newRating) {
            if (newRating === 0) {
                this.ignoreRating(0);
            }
        },
        closeSystemChat: function () {
            this.groups = [];
            this.existingMsgIds = {};
        }
    },

    methods: {
        scrollToMessage(msgId, block) {
            if (!this.opened) return;

            let scrollToMessageId;

            if (msgId) {
                scrollToMessageId = msgId;
            }

            if (this.firstUnreadMessageId) {
                scrollToMessageId = this.firstUnreadMessageId;
            }

            const lastGroup = this.groups[this.groups.length - 1]
            const lastMsg = lastGroup?.Messages[lastGroup.Messages.length - 1]
            if (lastMsg) {
                scrollToMessageId = lastMsg.Id
            }

            if (!scrollToMessageId) {
                return
            }
            const observer = new MutationObserver(() => {
                const messageElement = document.getElementById('message-' + msgId)
                if (messageElement) {
                    observer.disconnect()
                    messageElement.scrollIntoView({
                        behavior: 'smooth',
                        block: block ?? 'center',
                        inline: 'center',
                    });
                }
            })
            observer.observe(document.body, { childList: true, subtree: true })
        },

        scrollToBottom() {
            const chat = document.getElementById('chat');
            chat.scrollTo({
                top: chat.scrollHeight + chat.scrollTop + chat.offsetHeight,
                behavior: 'smooth'
            });
            // chat.scrollTo


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

        cancelSearch() {
            this.searching = false;
        },

        scrollToFoundMessage(id, block) {
            this.searching = false;
            client.channelMessages(this.channel, this.chatType, null, id).then(messages => {
                this.appendMessages(messages);
                this.scrollToMessage(id, block)
                this.animateMsgAfterScroll(id);
            });
        },

        queryMessages(value) {
            client.channelMessages(this.channel, this.chatType, value).then(messages => {
                this.lastEventId = messages.length
                    ? messages[messages.length - 1].EventId
                    : null;
                this.groups = [];
                this.existingMsgIds = {};
                this.appendMessages(messages);
            })
        },

        optionClicked(event) {
            switch (event) {
                case "search":
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
                this.existingMsgIds = {};
                this.appendMessages(messages, true);
                this.markMessages();
                if (subscribeNeeded) {
                    this.subscribe();
                }

                this.$emit('on-messages-loaded')
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

        appendMessages(messages, scrollToLastMessage) {
            if (messages.length > 0) {
                this.disableFreeText = messages[messages.length - 1].DisableFreeText || false;
            }

            for (let message of messages) {
                this.appendMessage(message);
            }

            if (messages.length > 0 && scrollToLastMessage) {
                this.scrollToMessage();
            }
        },

        prependMessages(messages) {
            for (let message of messages) {
                this.prependMessage(message);
            }
        },

        prependMessage(message) {
            if (this.existingMsgIds[message.Id]) {
                return;
            }
            this.messageGroupsPrepend(this.groups, message);
        },

        appendMessage(message, scrollToMessage) {
            if (this.existingMsgIds[message.Id]) {
                return;
            }
            this.messageGroupsAppend(this.groups, message);


            if (scrollToMessage) {
                this.scrollToMessage(message.Id);
            }
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
            this.appendMessage(message);
            return message;
        },

        replaceMessage(message, scrollToMessage) {
            if (this.messageGroupsReplace(this.groups, message)) {
                this.groups.push({}); // FIX: have to use to simulate object change,
                this.groups.pop(); // because i couldn't find way to fire deep object changes
                return true;
            }

            if (scrollToMessage && message.Id) {
                this.scrollToMessage(message.Id);
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
                            this.disableFreeText = group.LastMessage.DisableFreeText

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
                            this.disableFreeText = group.LastMessage.DisableFreeText
                        }
                        return true;
                    }
                }
            }
            return false;
        },

        messageGroupsAppend(groups, message) {
            if (groups.length > 0) {
                const lastGroup = groups[groups.length - 1];
                const lastMessage = lastGroup.Messages[lastGroup.Messages.length - 1];
                if (
                    lastGroup.Author === message.Author &&
                    lastGroup.UserId === message.UserId &&
                    lastGroup.ClientId === message.ClientId &&
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
                    lastGroup.Messages.push(message);
                    this.existingMsgIds[message.Id] = true;
                    lastGroup.LastMessage = message;
                    this.singleChoices = lastGroup.LastMessage.SingleChoices
                    this.disableFreeText = lastGroup.LastMessage.DisableFreeText

                    if (message.InfoRequest && message.InfoRequest.State !== 'finished') {
                        lastGroup.InfoRequest = message.InfoRequest;
                    }

                    if (message.Rating) {
                        lastGroup.Rating = message.Rating;
                    }
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
            this.existingMsgIds[message.Id] = true;
        },

        messageGroupsPrepend(groups, message) {
            if (groups.length > 0) {
                const firstGroup = groups[0];
                const firstMessage = firstGroup.Messages[0];

                if (
                    firstGroup.Author === message.Author &&
                    firstGroup.UserId === message.UserId &&
                    firstGroup.ClientId === message.ClientId &&
                    firstMessage.CreatedAt - message.CreatedAt < 60000 &&
                    isSameDate(message.CreatedAt, firstMessage.CreatedAt)
                ) {
                    firstGroup.Messages = [message, ...firstGroup.Messages]
                    this.existingMsgIds[message.Id] = true;
                    return;
                }
            }

            const isNewDay =
                groups.length > 0
                    ? !isSameDate(
                        message.CreatedAt,
                        groups[0].Messages[0].CreatedAt
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
            groups = [group, ...groups]
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
                if (!settings) return;

                this.systemChat = true
                client.listTicketsByClient(this.channel, this.client.Id, { Open: true }).then(result => {
                    if (result.Data.TotalCount) {
                        this.systemChat = false;
                        return;
                    }

                    if (settings.GreetFrom === 'bot') {
                        client.openSystemChat(this.channel)
                    } else {
                        const now = new Date()
                        const message = {
                            Id: now.getTime(),
                            Author: "user",
                            CreatedAt: now,
                            Text: settings.Message,
                            Payload: 'text',
                            Read: true,
                            UserId: now.getTime(),
                            User: {
                                DisplayName: settings.OperatorName,
                                Name: settings.OperatorName,
                                Active: true,
                            }
                        };
                        this.appendMessage(message, true)
                        setTimeout(() => {
                            this.removeMessage(message);
                            this.systemChat = false
                        }, 1000 * settings.Lifetime)
                    }
                })
            })
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
                    this.replaceMessage(message, true);
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
            const message = this.getMesssageByLocalId(localId);
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

        handleIncomingMessage(message) {
            if (!message) {
                return false;
            }
            if (!message.My) {
                this.appendMessage(message);
                return true;
            }

            if (!this.replaceMessage(message, true)) {
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

            client.channelSend(this.channel, messageForm);
        },

        handleVersion() {
            client.version().then(res => {
                const now = new Date()
                const message = {
                    Id: now.getTime(),
                    Author: "user",
                    CreatedAt: now,
                    Text: res.Data.Version,
                    Payload: 'text',
                    Read: true,
                    UserId: now.getTime(),
                    User: {
                        DisplayName: "Система",
                        Name: "Система",
                        Active: true
                    }
                };
                this.appendMessage(message, true);
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

        onScrolledToTop() {
            if (this.loadingMore) {
                return;
            }
            this.currentLimit += 50;
            this.loadingMore = true;
            client.channelMessages(this.channel, this.chatType, null, null, this.groups[0]?.Messages[0].Id).then(messages => {
                this.prependMessages(messages.reverse());
                this.loadingMore = false;
            }).catch(() => {
                this.loadingMore = false;
            });
        },

        initScrollEvents() {
            const chat = document.getElementById('chat');
            chat.addEventListener('scroll', event => {
                const container = event.currentTarget;
                const atTop = container.scrollTop === 0;
                if (atTop) {
                    this.onScrolledToTop()
                }
            });
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

        .loading-more
            fade-loader.loader(v-if="loadingMore" :height="'6px'" :width="'2px'" :radius="'7px'" :color="'#b9b9b9'")
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

.loading-more {
    justify-content: center;
    display: flex;

    .loader {
        top: 10px;
    }
}
</style>
