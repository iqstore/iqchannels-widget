<style lang="scss">
.chats {
  background-color: #f0f0f0;
  overflow: hidden;
  height: 100%;
  user-select: none;
}

.chat {
  padding: 10px 5px;
  width: 100%;
  height: 3rem;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #e8e8e8;
  }
}

.offscreen-block {
  position: absolute;
  left: 100%;
  right: -100%;
  top: 50%;
  width: 100%;
  height: 100%;
  transform: translateY(-50%);
  transition: all 0.25s ease;
  visibility: hidden;
  z-index: 1;
}

.visible-block {
  left: 0;
  right: 0;
  visibility: visible;
}
</style>

<template lang="pug">
  .chats
    template(v-for="(value, name) in multiClient")
      .chat(v-wave, @click.prevent="setCurrentChat(name, 'regular')")
        chat-container(:chat="value")
      .chat(
        v-wave,
        @click.prevent="setCurrentChat(name, 'personal_manager')",
        v-if="value.PersonalManagerId && value.MultiChatsInfo.EnableForPersonalManagers"
      )
        chat-container(:chat="value", :is-with-personal-manager="true")

  .offscreen-block(:class="{ 'visible-block': chatSelected }")
    messenger(
      ref="messenger",
      v-if="multiClient && currentChannel",
      @on-unread-changed="onUnreadChanged",
      @on-message-received="onMessageReceived",
      @on-file-clicked="onFileClicked",
      @on-close="onClose",
      @on-logout="onLogout",
      @on-longtap="onLongTap",
      @on-rating="onRating",
      @on-back="onBack",
      :mode="mode",
      :client="multiClient[currentChannel]",
      :opened="opened",
      :channel="currentChannel",
      :replayed-msg="replayedMsg",
      :scrollToMsg="scrollToMsg",
      :rating="rating",
      :closeSystemChat="closeSystemChat",
      :doc-width="docWidth",
      :is-multiple="true",
      :chat-type="currentChatType",
    )

</template>

<script>

import ChatContainer from "../components/chat-container.vue";

export default {
  name: "multi-messenger",
  components: { ChatContainer },

  props: {
    mode: String,
    opened: Boolean,
    channel: String,
    replayedMsg: Object,
    scrollToMsg: Object,
    closeSystemChat: Boolean,
    typing: Object,
    rating: Number,
    multiClient: Object,
    docWidth: Number,
    chats: Array,
  },

  data() {
    return {
      currentChannel: null,
      currentChatType: "",
      chatSelected: false,
    };
  },

  methods: {
    setCurrentChat(channel, type) {
      this.currentChannel = channel;
      this.chatSelected = true;
      this.currentChatType = type;
    },

    // Events
    onUnreadChanged(newValue, oldValue) {
      this.$emit("on-unread-changed", newValue);
    },

    onMessageReceived() {
      this.$emit("on-message-received");
    },

    onFileClicked(file) {
      this.$emit("on-file-clicked", file);
    },

    onClose() {
      this.$emit("on-close");
    },

    onLogout() {
      this.$emit("on-logout");
    },

    onLongTap(msg) {
      this.$emit("on-longtap", msg);
    },

    onRating(rating) {
      this.$emit("on-rating", rating);
    },

    onBack() {
      this.chatSelected = false;
      setTimeout(() => {
        this.currentChannel = null;
      }, 250);
    },

    appendText(text) {
      this.$refs.messenger.appendText(text);
    },
  }
}
</script>