<style lang="scss" scoped>
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

a.close, a.close:active, a.close:visited, a.close:focus {
  position: absolute;
  padding: 1em 0.8em 1em 0.8em;
  right: 0;
  top: 0;
  color: #666666;
}

a.logout, a.logout:active, a.logout:visited, a.logout:focus {
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
  position: relative;
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

.wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}

.messenger {
  height: 100%;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
}

.scrollBottom {
  width: 32px;
  height: 32px;
  position: sticky;
  bottom: 0;
  background: #EBEBEB;
  border-radius: 50%;
  display: flex;
  z-index: 2;
  left: 0;
  margin-right: 8px;
  margin-left: auto;

  svg {
    margin: auto;
  }
}

.chat-type-container {
  padding: 8px;
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
  white-space: pre-wrap; /* css-3 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */
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

.search-icon {
  margin-left: 5px;
  padding: 5px;
  cursor: pointer;
  font-size: 30px;
}

.comment-icon {
  margin-left: 5px;
  padding: 5px;
  cursor: pointer;
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

</style>

<template lang="pug">
  .wrapper
    .messenger
      .header
        .content
          div.client-name-container(v-if="mode !== 'mobile'")
            p {{ client.Name }}
            p(v-if="anonymous")
              a.logout(href="#" @click.prevent="onLogoutClicked") удалить переписку
            a.close(href="#" @click.prevent="onCloseClicked" title="Закрыть переписку")
              svg(xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512")
                path(d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z")
          div(style="display:flex")
            span.search-icon(title="Поиск по чату", @click.prevent="searchMsg()")
              svg(xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512")
                path(d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z")
            div.chat-type-container(v-if="searching || !hasPersonalManager", style="display:flex; width:100%" )
              input.search-input(type="text" placeholder="Введите текст сообщения", v-model="search")
              span.comment-icon(v-if="hasPersonalManager" title="Назад", @click.prevent="cancelSearch()")
                svg(xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512")
                  path(d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z")
            div.chat-type-container(v-if="hasPersonalManager && !searching")
              select(name="chat-type" @change="onChatTypeSelected").chat-type-select
                option(selected value="regular") Общий чат
                option(value="personal_manager") Чат с персональным менеджером

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
          :docWidth="docWidth",
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
        .scrollBottom(v-if="!isBottom && !this.searching" @click="scrollToLastMessage(false)")
          svg(width='12' height='7' viewbox='0 0 12 7' fill='none' xmlns='http://www.w3.org/2000/svg')
            path(d='M11 1L6.07071 5.92929C6.03166 5.96834 5.96834 5.96834 5.92929 5.92929L1 1' stroke='#767B81' stroke-width='1.5' stroke-linecap='round')
        .div(v-if="groups.length && groups[groups.length -1].LastMessage.SingleChoices !== null")
          div.choice_box(v-if="groups[groups.length -1].LastMessage.IsDropDown")
            button.choice_button(type="button",
              v-for="choice in groups[groups.length -1].LastMessage.SingleChoices",
              @click.prevent="onMessageComposed(choice.title, choice.value, choice.URL)") {{ choice.title }}
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
</template>

<script>
import chat from './chat.vue';
import composer from './composer.vue';
import client from '../../client';
import * as schema from '../../schema';
import { isSameDate } from '../../lib/datetime';
import { retryTimeout } from '../../lib/timeout';


export default {
  components: { chat, composer },

  props: {
    mode: String,
    opened: Boolean,
    channel: String,
    replayedMsg: Object,
    scrollToMsg: Object,
    closeSystemChat: Boolean,
    typing: Object,
    rating: Number,
    chatTypeProp: String,
    client: Object,
    docWidth: Number,
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
    this.chatType = this.chatTypeProp;
    this.loadHistory();
    this.sendGreeting();
    document.getElementById('chat').addEventListener('scroll', ev => {
      setTimeout(() => {
        const height = document.getElementById('chat').offsetHeight;
        // add 1px because the difference is 0.333 for some reason
        this.isBottom = !((ev.target.scrollHeight - ev.target.scrollTop - 1) >= height);
      }, 300);
    });
  },

  beforeUnmount() {
    this.unsubscribe();
  },

  data: () => {
    return {
      // reactive props
      groups: [],
      searching: false,
      cashedGroups: [],
      search: "",
      inputMsg: {},
      inputTyping: {},
      isBottom: true,
      systemChat: false,
      singleChoices: [],
      disableFreeText: false,
      shouldBeScrolledBottom: true,
      chatType: 'regular',
    };
  },

  computed: {
    incomingMessages: function () {
      if (!this.client) return [];
      const clientId = this.client.Id;
      return this.groups.reduce(
          (result, group) =>
              result.concat(group.Messages.filter(m => m.ClientId !== clientId)),
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
      return !!this.client.PersonalManagerId;
    },

  },
  watch: {
    opened: function (newValue, oldValue) {
      if (newValue && !oldValue) {
        // widget opened
        this.markMessagesAsRead();
        this.sendGreeting();
        // Force fixed element to repaint,
        // because of safari issue with fixed hidden elements
        $("#composer")
            .hide()
            .show(0);
        this.setScrollPositionToBottom();
        this.scrollToLastMessage();
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
      const el = $('#chat');
      el.stop().animate({
        scrollTop: el[0].scrollHeight
      }, 800);
    },

    setScrollPositionToBottom() {
      const chatElement = $('#chat');
      chatElement[0].scrollTop = chatElement[0].scrollHeight - chatElement[0].clientHeight;
    },

    searchMsg() {
      this.searching = true;
      this.cashedGroups = this.groups;
    },

    scrollToFoundMessage(id) {
      this.shouldBeScrolledBottom = false;
      this.searching = false;
      this.search = "";
      client.channelMessages(this.channel, this.chatType, null, id).then(messages => {
        this.appendMessages(messages);
      });
      setTimeout(() => {
        const msgElement = document.getElementById(id);
        msgElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
        this.shouldBeScrolledBottom = true;
        this.animateMsgAfterScroll(id);
      }, 2000);
    },
    scrollToPushMessage(msg) {
      document.getElementById(msg).scrollIntoView({
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
      this.cashedGroups = [];
      this.searching = false;
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

    loadHistory() {
      client.channelMessages(this.channel, this.chatType).then(messages => {
        this.lastEventId = messages.length
            ? messages[messages.length - 1].EventId
            : null;
        this.groups = [];
        this.appendMessages(messages);
        this.markMessages();
        this.subscribe();
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
      const ids = [];
      for (let message of this.unreadMessages) {
        ids.push(message.Id);
        message.Read = message.Received = true;
        message.ReadAt = message.ReceivedAt = new Date().getTime();
      }
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
      // IQ-276 Duplicate messages.
      // A quick fix.
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
      this.appendMessage(message);
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
            group.Messages[i] = message;
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
          group.Messages.push(message);
          group.LastMessage = message;
          this.singleChoices = group.LastMessage.SingleChoices
          if (group.LastMessage.DisableFreeText) {
            this.disableFreeText = true
          } else {
            this.disableFreeText = false
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
      this.client.Name = info.FirstName + " " + info.SurName;
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
        this.scrollToLastMessage();
        return true;
      }
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

    onMessageComposed(text, botpressPayload, url) {
      if (url) {
        window.open(url, '_blank').focus();
        return;
      }
      let messageForm;
      if (text.messageText === "/version") {
        this.handleVersion();
        return;
      }

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

    onStartTyping() {
      client.channelTyping(this.channel, this.chatType).catch(() => {
        // ignore error, cause event is transitive
      });
    },

    onFileSelected(file, text, id) {
      let messageForm;
      if (id) {
        messageForm = this.newFileMessageWithReply(file, id, text);
      } else {
        messageForm = this.newFileMessage(file, text);
      }
      const message = this.appendLocalMessage(messageForm);
      this.uploadMessage(message);
    },

  }
};
</script>
