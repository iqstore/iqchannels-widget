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
import { ChatEventRatingIgnored } from "../../schema";

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
        imgModalOptions: Object,
        isMultiple: Boolean,
        appError: Object,
        metadata: Object,
        chatTypeProp: String
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
        this.lastEventID = null;
        // last generated local message id, to make
        // sure next generated value will be greater
        this.lastLocalID = 0;

        this.chatType = this.chatTypeProp;
    },

    mounted() {
        this.loadHistory();
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
            firstUnreadMessageID: 0,
            loadingMore: false,
            existingMsgIDs: {},
            isBottom: false,
            settings: {},
            languages: [],
        };
    },

    computed: {
        incomingMessages: function () {
            if (!this.client) return [];
            return this.groups.reduce(
                (result, group) => {
                    result = [...result, ...group.Messages].filter(m => !m.ClientID)
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
            return !!this.client.PersonalManagerID || !!this.client.PersonalManagerGroupID;
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
                if (!this.systemChat) {
                    this.sendGreeting();
                }
            }

            // widget closed
            if (!newValue) {
                this.firstUnreadMessageID = null;
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
            if (newRating == null) {
                this.ignoreRating(null);
            }
        },
        closeSystemChat: function () {
            this.groups = [];
            this.existingMsgIDs = {};
        }
    },

    // options: {checkIsBottom: Boolean, scrollIsBottomValue: boolean, scrollToLast: boolean, block: "center" | "end" | "nearest" | "start"}
    methods: {
        scrollToMessage(msgID, options) {
            if (!this.opened) return;

            if (options?.checkIsBottom) {
                if (this.isBottom !== options?.scrollIsBottomValue) {
                    return;
                }
            }

            let scrollToMessageID;

            if (msgID) {
                scrollToMessageID = msgID;
            }

            if (this.firstUnreadMessageID) {
                scrollToMessageID = this.firstUnreadMessageID;
            }

            const lastGroup = this.groups[this.groups.length - 1]
            const lastMsg = lastGroup?.Messages[lastGroup.Messages.length - 1]
            if (lastMsg) {
                scrollToMessageID = lastMsg.ID
            }

            if (!scrollToMessageID) {
                return
            }
            const observer = new MutationObserver(() => {
                const messageElement = document.getElementById('message-' + scrollToMessageID)
                if (messageElement) {
                    observer.disconnect()
                    messageElement.scrollIntoView({
                        behavior: 'smooth',
                        block: options?.block ?? 'center',
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

            this.resetUnreadCount();
        },

        scrollToRating(ratingID, index) {
            const observer = new MutationObserver(() => {
                const rating = document.getElementById('rating-' + ratingID + '-index-' + index);
                if (rating) {
                    observer.disconnect();
                    rating.scrollIntoView(false);
                }
            })

            observer.observe(document.body, { childList: true, subtree: true })
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
                this.lastEventID = messages.length
                    ? messages[messages.length - 1].EventID
                    : null;
                this.groups = [];
                this.existingMsgIDs = {};
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

        animateMsgAfterScroll(msgID) {
            this.$refs.chat.animateMsgAfterScroll(msgID);
        },

        // Private

        loadHistory(subscribeNeeded = true) {
            client.channelMessages(this.channel, this.chatType).then(messages => {
                this.lastEventID = messages.length
                    ? messages[messages.length - 1].EventID
                    : null;
                this.groups = [];
                this.existingMsgIDs = {};
                this.appendMessages(messages, true);
                this.markMessages();
                if (subscribeNeeded) {
                    this.subscribe();
                }

                this.$emit('on-messages-loaded')
                this.sendGreeting();
            });
        },

        setLanguage(code) {
            client.setLanguage(code);
        },

        subscribe() {
            this.unsubscribe();
            if (this.subscription) {
                this.subscription.close();
            }
            if (this.subscriptionTimeout) {
                this.loadHistory(false);
                clearTimeout(this.subscriptionTimeout);
            }
            this.subscription = client.channelListen(
                this.channel,
                this.chatType,
                this.lastEventID,
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
            client.logMessage(`Subscribe error, retry in ${timeout}ms:` + JSON.stringify(error));
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
                ids.push(message.ID);
                message.Received = true;
                message.ReceivedAt = new Date().getTime();
            }
            if (ids.length) {
                client.channelMessagesReceived(ids);
            }
        },

        markMessagesAsRead() {
            const ids = this.unreadMessages.map(({ ID }) => ID);
            if (ids.length) {
                client.channelMessagesRead(ids);
            }
        },

        appendMessages(messages, scrollToLastMessage) {
            const lastDisable = messages.length
                ? messages[messages.length - 1].DisableFreeText
                : false;

            for (let message of messages) {
                this.appendMessage(message);
            }

            if (!lastDisable) this.disableFreeText = false;

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
            if (this.existingMsgIDs[message.ID]) {
                return;
            }
            this.messageGroupsPrepend(this.groups, message);
        },


        appendMessage(message, scrollToMessage) {
            if (this.existingMsgIDs[message.ID]) {
                return;
            }
            this.messageGroupsAppend(this.groups, message);


            if (scrollToMessage) {
                this.scrollToMessage(message.ID);
            }
        },

        appendLocalMessage(messageForm, scrollToMessage) {
            this.groups.forEach((group) => {
                if (['pending', 'poll'].includes(group.Rating?.State)) {
                    this.ignoreRating(group.Rating);
                }
            })

            const message = Object.assign({}, messageForm, {
                ID: new Date().getTime() + "",
                Client: this.client,
                ClientID: this.client.ID,
                Author: "client",
                CreatedAt: new Date(),
                ReplyToMessageID: messageForm.ReplyToMessageID
            });
            this.firstUnreadMessageID = null;

            this.appendMessage(message, scrollToMessage);
            return message;
        },

        replaceMessage(message, scrollToMessage) {
            if (this.messageGroupsReplace(this.groups, message)) {
                this.groups.push({}); // FIX: have to use to simulate object change,
                this.groups.pop(); // because i couldn't find way to fire deep object changes
                return true;
            }

            if (scrollToMessage && message.ID) {
                this.scrollToMessage(message.ID);
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

        getMessageByLocalID(localID) {
            for (let g = this.groups.length - 1; g >= 0; g--) {
                for (let i = this.groups[g].Messages.length - 1; i >= 0; i--) {
                    const message = this.groups[g].Messages[i];
                    if (message.LocalID === localID) {
                        return message;
                    }
                }
            }
            return null;
        },

        getMessageByID(id) {
            for (let g = this.groups.length - 1; g >= 0; g--) {
                for (let i = this.groups[g].Messages.length - 1; i >= 0; i--) {
                    const message = this.groups[g].Messages[i];
                    if (message.ID && message.ID === id) {
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
                        (msg.ID && msg.ID === message.ID) ||
                        msg.LocalID === message.LocalID
                    ) {
                        const old = group.Messages[i].ID;
                        group.Messages[i] = { ...message };
                        delete this.existingMsgIDs[old];
                        this.existingMsgIDs[message.ID] = true;

                        if (i === group.Messages.length - 1) {
                            group.LastMessage = message;
                            this.singleChoices = group.LastMessage.SingleChoices
                            this.disableFreeText = group.LastMessage.DisableFreeText

                        }

                        if (group.Rating && message.Rating) {
                            group.Rating = message.Rating;
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
                        (msg.ID && msg.ID === message.ID) ||
                        msg.LocalID === message.LocalID
                    ) {
                        const deleted = group.Messages.splice(i, 1);
                        delete this.existingMsgIDs[deleted[0].ID];
                        if (group.Messages.length === 0) {
                            groups.splice(g, 1);
                        } else {
                            group.LastMessage = group.Messages[group.Messages.length - 1];
                            this.singleChoices = group.Messages[group.Messages.length - 1].SingleChoices;
                            this.disableFreeText = group.LastMessage.DisableFreeText ?? false
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
                    lastGroup.UserID === message.UserID &&
                    lastGroup.ClientID === message.ClientID &&
                    message.CreatedAt - lastMessage.CreatedAt < 60000 &&
                    isSameDate(message.CreatedAt, lastMessage.CreatedAt) &&
                    message.TicketID === lastMessage.TicketID
                ) {

                    if (!message.Read && message.Author === 'user'
                        && !this.opened
                        && (!this.firstUnreadMessageID || this.firstUnreadMessageID > message.ID)) {
                        this.firstUnreadMessageID = message.ID;
                    }
                    if (message.My && message.ID > this.firstUnreadMessageID) {
                        this.firstUnreadMessageID = null;
                    }
                    lastGroup.Messages.push(message);
                    this.existingMsgIDs[message.ID] = true;
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
                ID: groups.length + 1,
                Author: message.Author,
                UserID: message.UserID,
                ClientID: message.ClientID,

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
            this.existingMsgIDs[message.ID] = true;
        },

        messageGroupsPrepend(groups, message) {
            if (groups.length > 0) {
                const firstGroup = groups[0];
                const firstMessage = firstGroup.Messages[0];

                if (
                    firstGroup.Author === message.Author &&
                    firstGroup.UserID === message.UserID &&
                    firstGroup.ClientID === message.ClientID &&
                    firstMessage.CreatedAt - message.CreatedAt < 60000 &&
                    isSameDate(message.CreatedAt, firstMessage.CreatedAt)
                ) {
                    firstGroup.Messages.unshift(message);
                    this.existingMsgIDs[message.ID] = true;
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
                ID: groups.length + 1,
                Author: message.Author,
                UserID: message.UserID,
                ClientID: message.ClientID,

                User: message.User,
                Client: message.Client,

                Messages: [message],
                LastMessage: message,
                Rating: message.Rating,

                IsNewDay: isNewDay
            };
            groups.unshift(group);
        },

        async sendGreeting() {
            const result = await client.getChatSettings(this.channel, this.client.ID)
            if (!result.Data) return;

            this.settings = result.Data;

            let text = this.settings.Message
            if (this.settings.Languages) {
                this.languages = await client.getLanguages(this.channel)
                const defaultLanguage = this.languages.find((language) => language.Default)

                if (!this.client.LanguageCode) {
                    this.client.LanguageCode = defaultLanguage.Code
                }

                if (this.settings?.Translations?.length) {
                    let translation;
                    if (this.client.LanguageCode) {
                        translation = this.settings?.Translations.find((translation) => translation.LanguageCode === this.client.LanguageCode)
                    } else {
                        translation = this.settings?.Translations.find((translation) => translation.LanguageCode === defaultLanguage.Code)
                    }
                    if (translation) {
                        text = translation.Translation
                    }
                }
            }

            if (this.systemChat) {
                return;
            }

            const lastGroup = this.groups[this.groups.length - 1]
            if (lastGroup && lastGroup.Rating && !lastGroup.LastMessage.RatingID) {
                return;
            }

            this.systemChat = true
            if (this.settings.TotalOpenedTickets) {
                this.systemChat = false;
                return;
            }

            if (this.settings.GreetFrom === 'bot') {
                client.openSystemChat(this.channel)
            } else {
                const now = new Date()
                const message = {
                    ID: now.getTime(),
                    Author: "user",
                    CreatedAt: now,
                    Text: text,
                    Payload: 'text',
                    Read: true,
                    SystemMessage: true, // for auto-invite logic
                    UserID: now.getTime(),
                    User: {
                        ID: this.settings.UserID,
                        DisplayName: this.settings.Pseudonym ? this.settings.Pseudonym : this.settings.OperatorName,
                        Name: this.settings.OperatorName,
                        Active: true,
                        AvatarID: this.settings.AvatarID
                    }
                };
                this.appendMessage(message, true)
                setTimeout(() => {
                    this.removeMessage(message);
                    this.systemChat = false
                }, 1000 * this.settings.Lifetime)
            }
        },

        getNextLocalID() {
            let localID = new Date().getTime();
            if (localID <= this.lastLocalID) {
                localID = this.lastLocalID + 1;
            }
            this.lastLocalID = localID;
            return localID;
        },

        newTextMessage(text, botpressPayload) {
            const msg = {
                LocalID: this.getNextLocalID(),
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
                LocalID: this.getNextLocalID(),
                Payload: schema.ChatPayloadText,
                Text: text,
                ReplyToMessageID: id,
                ChatType: this.chatType
            }
            if (this.disableFreeText) {
                msg.DisableFreeText = true;
            }
            return msg;
        },

        newFileMessage(file, text) {
            return {
                LocalID: this.getNextLocalID(),
                Payload: schema.ChatPayloadFile,
                Text: text,
                Upload: file,
                ChatType: this.chatType
            };
        },

        newFileMessageWithReply(file, id, text) {
            return {
                LocalID: this.getNextLocalID(),
                Payload: schema.ChatPayloadFile,
                Text: text,
                Upload: file,
                ReplyToMessageID: id,
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
                    message.FileID = file.ID;
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

        cancelUpload(localID) {
            const message = this.getMessageByLocalID(localID);
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

        retryUpload(localID) {
            const message = this.getMesssageByLocalID(localID);
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
                .rateRating(rating.ID, rating.Value, rating.Comment)
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

            rating.Sending = client.ignoreRating(rating.ID).then(
                ignored => {
                    rating.Sending = null;
                    rating.State = ignored.State;
                    rating.Value = null;
                },
                error => {
                    rating.Sending = null;
                    rating.Value = null;
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

            info.Sending = client.ignoreInfo(info.ID).then(
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
            client.fileSignedUrl(file.ID).then(
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
                    client.logMessage(error);
                }
            );
        },

        clickFile(file) {
            if (file.ID) {
                client.fileSignedUrl(file.ID).then(
                    url => {
                        this.$emit("on-file-clicked", url);
                    },
                    error => {
                        client.logMessage(error);
                    }
                );
            } else {
                this.$emit("on-file-clicked", file);
            }
        },

        clickFileImg(msg) {
            this.$emit("on-image-clicked", msg);
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

        onClientLanguageSelected(event) {
            const languageCode = event.target.value
            client.LanguageCode = languageCode
            this.setLanguage(languageCode);
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
                    case schema.ChatEventRatingIgnored:
                        this.replaceMessage(event.Message, false);
                        break;
                    default:
                        client.logMessage("Unhandled channel event" + JSON.stringify(event));
                }
                this.lastEventID = event.ID;
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
                const lastGroup = this.groups[this.groups.length - 1]
                const lastMsg = lastGroup?.Messages[lastGroup.Messages.length - 1]

                this.appendMessage(message);

                const scrollOptions = {}
                if (lastMsg && message && message.CreatedAt - lastMsg.CreatedAt > 200) {
                    scrollOptions.checkIsBottom = true
                    scrollOptions.scrollIsBottomValue = true
                }
                if (message.Text?.length > 500) {
                    scrollOptions.block = "end"
                }

                this.scrollToMessage(message, scrollOptions);
                return true;
            }

            if (!this.replaceMessage(message, true)) {
                this.appendMessage(message);
            }
            return false;
        },

        handleIncomingRead(event) {
            const message = this.getMessageByID(event.MessageID);
            if (!message) {
                return;
            }
            message.Read = message.Received = true;
            message.ReadAt = message.ReceivedAt = event.CreatedAt;
            this.replaceMessage(message);
        },

        handleIncomingListened(event) {
            const message = this.getMessageByID(event.MessageID);
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
            const message = this.getMessageByID(event.MessageID);
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
            let message = this.getMessageByID(event.MessageID);
            if (!message) {
                return;
            }
            client.getFile(message.FileID).then(file => {
                message = { ...message, File: file };
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
                messageForm = this.newTextMessageWithReply(text.messageText, text.replyToMessageID, botpressPayload);
            }

            messageForm.Metadata = this.metadata;
            this.appendLocalMessage(messageForm, true);


            client.channelSend(this.channel, messageForm);
        },

        handleVersion() {
            client.version().then(res => {
                const now = new Date()
                const message = {
                    ID: now.getTime(),
                    Author: "user",
                    CreatedAt: now,
                    Text: res.Data.Version,
                    Payload: 'text',
                    Read: true,
                    UserID: now.getTime(),
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
            this.$emit("on-typing");
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
            const chat = document.getElementById('chat');
            const oldScrollHeight = chat.scrollHeight;
            const oldScrollTop = chat.scrollTop;
            this.loadingMore = true;
            client.channelMessages(this.channel, this.chatType, null, null, this.groups[0]?.Messages[0].ID).then(messages => {
                this.prependMessages(messages.reverse());
                this.loadingMore = false;
                this.$nextTick(() => {
                    const newScrollHeight = chat.scrollHeight;
                    chat.scrollTop = newScrollHeight - oldScrollHeight + oldScrollTop;
                })
            }).catch(() => {
                this.loadingMore = false;
            });
        },

        initScrollEvents() {
            const chat = document.getElementById('chat');
            chat.addEventListener('scroll', event => {
                if (this.$refs.chat.$refs.msgContextMenu.active) {
                    this.$refs.chat.$refs.msgContextMenu.hideContextMenu();
                }
                const container = event.currentTarget;
                const atTop = container.scrollTop === 0;
                if (atTop) {
                    this.onScrolledToTop()
                }
            });
        },

        onIsBottomChanged(isBottom) {
            this.isBottom = isBottom;
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
                div.chat-header(v-if="mode !== 'mobile'")
                    .language
                        select(v-if="languages?.length", name="language" @change="onClientLanguageSelected" v-model="client.LanguageCode").language-select
                            option(v-for="language in languages", :value="language.Code")
                                div.language-option
                                    p {{ language.Name }}
                    p {{ settings.ChatTitle }}
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
                :imgModalOptions="imgModalOptions",
                :firstUnreadMessageID="firstUnreadMessageID",
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
                @scroll-to-message="(id) => scrollToFoundMessage(id)",
                @scroll-to-bottom="() => scrollToBottom()",
                @scroll-to-rating="(ratingID, index) => scrollToRating(ratingID, index)",
                @click-file="clickFile",
                @click-file-img="clickFileImg",
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

    scroll-bottom(@on-click="scrollToBottom", @on-reached-bottom="resetUnreadCount", @is-bottom-chaned="onIsBottomChanged",  :unreadCount="unreadCount")

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

        .chat-header {
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

.language-option {
    display: flex;
    gap: 5px;
}

.language {
    display: flex;
    gap: 5px;
    position: absolute;
    left: 20px;
    .language-select {
        background-color: transparent;
        border: 0;
    }
}
</style>
