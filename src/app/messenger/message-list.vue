<style lang="scss">
.message-wrapper {
    display: flex;
    flex-flow: column;
    transition: all 0.3s;
    font-size: 14px;
    touch-action: pan-y !important;
}

.scroll_msg_animation_user {
    animation: 2s afterScrollAnimateUser ease-out forwards;
}

@keyframes afterScrollAnimateUser {
    0% {
        background: none;
    }

    50% {
        background: var(--color-after-scroll-animation_user);
    }

    100% {
        background: none;
    }
}

.scroll_msg_animation_client {
    animation: 2s afterScrollAnimateClient ease-out forwards;
}

.file_state-not_approved {
    text-align: center;

    .rejected {
        color: red;
    }

    .check_error {
        color: red;
    }

    .on_checking {
        color: #2D98F4;
    }

    .sent_for_checking {
        color: #2D98F4;
    }
}

@keyframes afterScrollAnimateClient {
    0% {
        background: none;
    }

    50% {
        background: var(--color-after-scroll-animation_client);
    }

    100% {
        background: none;
    }
}

.unread-divider {
    margin: 10px 0 10px 0;
    color: #656565;
    text-align: center;
    font-size: 14px;
    display: flex;
    width: 100%;
    align-items: center;
    white-space: nowrap;

    span {
        padding: 4px;
    }

    &::before,
    &::after {
        content: "";
        width: 100%;
        border-top: 0.5px #656565 solid;
    }
}
</style>

<template lang="pug">
.message-wrapper(v-for="(msg, index) in group.Messages",
    v-hammer:pan="(event) => swipeRight(event, msg)",
    :class="{ scroll_msg_animation_client: msg.My && animateMsgIds[msg.Id], scroll_msg_animation_user: !msg.My && animateMsgIds[msg.Id] }",
    :id="'message-'+msg.Id")

    .unread-divider(v-if="firstUnreadMessageId === msg.Id")
        span Непрочитанные сообщения

    message(
        @reply-msg="optionClicked",
        @scroll-to-message="scrollToMessage",
        @send-message="sendMessage"
        :group="group",
        :groups="groups",
        :msg="msg",
        :searching="searching",
        :enableImgModals="enableImgModals",
    )


</template>

<script>
import Message from "./message/message.vue";


export default {
    components: { Message },

    props: {
        searching: Boolean,
        group: Object,
        groups: Array,
        firstUnreadMessageId: Number,
        enableImgModals: Boolean,
        animateMsgIds: Array
    },

    data: function () {
        return {
            animateMsgIds: {},
        }
    },

    methods: {
        swipeRight(event, msg) {
            this.$emit("swipe-rigth", event, msg)
        },

        optionClicked(event) {
            this.$emit("reply-msg", event);
        },

        scrollToMessage(msg, event) {
            this.$emit("scroll-to-message", msg, event)
        },

        sendMessage(messageText, botpressPayload, url) {
            this.$emit("send-message", messageText, botpressPayload, url)
        },
    }
}

</script>
