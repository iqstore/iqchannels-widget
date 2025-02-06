<script>

import ChatContainer from "../components/chat-container.vue";
import client from "../../client";

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
        chats: Array,
        metadata: Object,
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
            client.setMultiAuth(this.currentChannel);
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

        onMessagesLoaded(rating) {
            this.$emit("on-messages-loaded", rating);
        },

        onBack() {
            this.chatSelected = false;
            setTimeout(() => {
                this.currentChannel = null;
                this.currentChatType = null;
            }, 250);
        },

        appendText(text) {
            this.$refs.messenger.appendText(text);
        },

        getChatType(value) {
            return value.PersonalManagerId && value.MultiChatsInfo?.EnableForPersonalManagers ?
                'personal_manager' : 'regular';
        },

        onImageClicked(msg) {
            this.$emit("on-image-clicked", msg);
        },
        onTyping(){
            this.$emit("on-typing"); 
        }
    }
}
</script>

<template lang="pug">
    .chats
        template(v-for="(value, name) in multiClient")
            .chat(v-wave, :id="'channel-'+getChatType(value)+'-'+name", @click.prevent="setCurrentChat(name, 'regular')")
                chat-container(:chat="value" :chat-name="name")
            .chat(
                v-wave,
                :id="'channel-'+getChatType(value)+'-'+name",
                @click.prevent="setCurrentChat(name, 'personal_manager')",
                v-if="value.PersonalManagerId && value.MultiChatsInfo?.EnableForPersonalManagers"
            )
                chat-container(:chat="value", :chat-name="name", :is-with-personal-manager="true")

    .offscreen-block(:class="{ 'visible-block': chatSelected }")
        messenger#messenger(
            ref="messenger",
            v-if="multiClient && currentChannel",
            @on-unread-changed="onUnreadChanged",
            @on-message-received="onMessageReceived",
            @on-file-clicked="onFileClicked",
            @on-close="onClose",
            @on-logout="onLogout",
            @on-longtap="onLongTap",
            @on-image-clicked='onImageClicked',
            @on-rating="onRating",
            @on-typing="onTyping",
            @on-back="onBack",
            @on-messages-loaded="onMessagesLoaded",
            :mode="mode",
            :client="multiClient[currentChannel]",
            :opened="opened",
            :channel="currentChannel",
            :replayed-msg="replayedMsg",
            :scrollToMsg="scrollToMsg",
            :rating="rating",
            :closeSystemChat="closeSystemChat",
            :is-multiple="true",
            :chat-type-prop="currentChatType",
            :metadata="metadata"
        )

</template>

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
    overflow-x: hidden;
    z-index: 1;
}

.visible-block {
    left: 0;
    right: 0;
    visibility: visible;
}
</style>
