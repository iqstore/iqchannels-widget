<style lang="sass" scoped>
    .header {
        min-height: 50px;
        width: 100%;
        background-color: #f0f0f0;
        text-align: center;
        display: table;
        .content {
            display: table-cell;
            vertical-align: middle;
            text-align: center;
            p {
                margin: 8px;
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
    }

    #composer {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 120px;
    }
</style>

<template lang="pug">
    .messenger
        .header
            .content
                p {{ client.Name }}
                p
                    a.logout(v-if="anonymous" href="#" @click.prevent="onLogoutClicked") удалить переписку
                a.close(href="#" @click.prevent="onCloseClicked" title="Закрыть переписку")
                    icon(name="close")
        #chat
            chat(
              v-bind:opened="opened",
              v-bind:groups="groups",
              @cancel-upload="cancelUpload",
              @retry-upload="retryUpload",
              @rate-rating="rateRating",
              @ignore-rating="ignoreRating")
        #composer
            composer(
              ref="composer"
              @message-composed="onMessageComposed" 
              @file-selected="onFileSelected" 
              @start-typing="onStartTyping")
</template>

<script>
import chat from "./chat.vue";
import composer from "./composer.vue";
import client from "../../client";
import config from "../../config";
import * as schema from "../../schema";
import { isSameDate } from "../../lib/datetime";
import { retryTimeout } from "../../lib/timeout";

export default {
  components: { chat, composer },

  props: {
    opened: Boolean,
    channel: String,
    client: Object
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
    this.adjustThreadHeight();
    window.addEventListener("resize", this.adjustThreadHeight);
    this.loadHistory();
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.adjustThreadHeight);
    this.unsubscribe();
  },

  data: () => {
    return {
      // reactive props
      groups: []
    };
  },

  computed: {
    incomingMessages: function() {
      if (!this.client) return [];
      const clientId = this.client.Id;
      return this.groups.reduce(
        (result, group) =>
          result.concat(group.Messages.filter(m => m.ClientId !== clientId)),
        []
      );
    },
    unreadMessages: function() {
      return this.incomingMessages.filter(m => m.Author == "user" && !m.Read);
    },
    unreceivedMessages: function() {
      return this.incomingMessages.filter(m => !m.Received);
    },
    unreadCount: function() {
      return this.unreadMessages.length;
    },
    anonymous: function() {
      return this.client.Type === "anonymous";
    }
  },

  watch: {
    opened: function(newValue, oldValue) {
      if (newValue && !oldValue) {
        // widget opened
        this.markMessagesAsRead();
        // Force fixed element to repaint,
        // because of safari issue with fixed hidden elements
        $("#composer")
          .hide()
          .show(0);
      }
    },
    unreadCount: function(newValue, oldValue) {
      this.$emit("on-unread-changed", newValue);
    }
  },

  methods: {
    // Public
    appendText(text) {
      if (!text) {
        return;
      }

      this.$refs.composer.appendText(text);
    },

    // Private

    loadHistory() {
      client.channelMessages(this.channel).then(messages => {
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
      for (let message of messages) {
        this.appendMessage(message);
      }
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
        CreatedAt: new Date()
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

      groups.push(group);
    },

    getNextLocalId() {
      let localId = new Date().getTime();
      if (localId <= this.lastLocalId) {
        localId = this.lastLocalId + 1;
      }
      this.lastLocalId = localId;
      return localId;
    },

    newTextMessage(text) {
      return {
        LocalId: this.getNextLocalId(),
        Payload: schema.ChatPayloadText,
        Text: text
      };
    },

    newFileMessage(file) {
      return {
        LocalId: this.getNextLocalId(),
        Payload: schema.ChatPayloadFile,
        Text: "",
        Upload: file
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

    // Handlers

    onCloseClicked() {
      this.$emit("on-close");
    },

    onLogoutClicked() {
      this.$emit("on-logout");
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
          case schema.ChatEventMessageReceived:
            this.handleIncomingReceived(event);
            break;
          case schema.ChatEventTyping:
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

    handleIncomingReceived(event) {
      const message = this.getMessageById(event.MessageId);
      if (!message) {
        return;
      }
      message.Received = true;
      message.ReceivedAt = event.CreatedAt;
      this.replaceMessage(message);
    },

    onMessageComposed(text) {
      const messageForm = this.newTextMessage(text);
      this.appendLocalMessage(messageForm);
      client.channelSend(this.channel, messageForm);
    },

    onStartTyping() {
      client.channelTyping(this.channel).catch(() => {
        // ignore error, cause event is transitive
      });
    },

    onFileSelected(file) {
      const messageForm = this.newFileMessage(file);
      const message = this.appendLocalMessage(messageForm);
      this.uploadMessage(message);
    },

    adjustThreadHeight() {
      const thread = $("#chat");
      if (thread.length === 0) return;
      const minHeight = 90; // Min height about 2 one line messages
      const height =
        window.innerHeight - // Document height
        thread.offset().top - // Chat div position
        $("#composer").height();
      thread.height(Math.max(height, minHeight));
    }
  }
};
</script>
