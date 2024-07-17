<style lang="scss">
.reply-icon {
    position: absolute;
    left: -25px;
}

.reply {
    flex-direction: column;
    display: flex;
    white-space: nowrap;
    padding-left: 5px;
    margin-bottom: 5px;
    font-size: 13px;

    &-client {
        border-left: 2px solid #456b84;
    }

    &-user {
        border-left: 2px solid black;
    }

    &-text {
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .message_file {
        align-items: center;
    }
}

.reply-author {
    margin-bottom: 5px;
    margin-top: 5px;
    font-size: 12px;
    font-weight: 600;

    &-user {
        color: black;
    }

    &-client {
        color: #456b84;
    }
}
</style>

<template lang="pug">
.reply-icon
    svg(width='14' height='12' viewbox='0 0 14 12' fill='none' xmlns='http://www.w3.org/2000/svg')
        path(d='M0.168205 5.31043L5.31015 0.16848C5.67006 -0.191429 6.28546 0.0634719 6.28546 0.572471V2.8604C9.55786 2.99642 12.4442 5.22457 13.359 8.39557C13.6644 9.45406 13.7406 10.3252 13.7166 11.2627C13.7135 11.3728 13.7128 11.4046 13.7128 11.4277C13.7128 12.0082 12.9474 12.2187 12.6505 11.7199C12.014 10.6504 11.291 9.82404 10.4991 9.21322C9.06731 8.10896 7.57668 7.78917 6.28549 7.91831V10.8564C6.28549 11.3654 5.67009 11.6203 5.31018 11.2604L0.168232 6.11841C-0.0549068 5.8953 -0.0549078 5.53354 0.168205 5.31043ZM5.14283 9.47707V7.4284C5.14283 7.16667 5.32068 6.93842 5.57446 6.87441C5.64398 6.85687 5.75946 6.83389 5.91613 6.81198C7.5345 6.58555 9.41461 6.93378 11.1969 8.3084C11.6353 8.64653 12.0529 9.03949 12.4473 9.48957L12.4385 9.44383C12.393 9.20926 12.3346 8.96702 12.2611 8.71231C11.4456 5.88536 8.77869 3.93434 5.82534 3.998C5.77542 3.99888 5.75699 3.99928 5.73388 4.00009C5.41082 4.01123 5.14285 3.75236 5.14285 3.42909V1.95177L1.38021 5.71442L5.14283 9.47707Z' fill='#456b84')
div(v-if="msg.ReplyToMessageId")
    .reply(@click="goToMessage(msg)", v-for="replyMsg of getReplyMsg(msg)" :class="{ 'reply-client': msg.Author === 'client', 'reply-user': msg.Author === 'user' }" )
        .reply-author(:class="{ 'reply-author-client': msg.Author === 'client', 'reply-author-user': msg.Author === 'user' }") {{ getAuthorAndText(msg).author }}
            div(v-if="replyMsg.Payload === 'carousel' && !replyMsg.File")
                pre.text
                button.img-button(v-for="action of replyMsg.Actions",
                @click.prevent="sendMessage(action.Title, action.Payload, action.URL)"
                ) {{ action.Title }}
            div(v-else-if="replyMsg.File && replyMsg.File.Type === 'image'")
                a.image(
                    v-if="!enableImgModals",
                    :href="replyMsg.File.URL",
                    target="_blank",
                    @click="clickFile(replyMsg, $event)"
                )
                    img.bubble(:src="replyMsg.File.ThumbnailURL", :class="{ first: index === 0, last: index === group.Messages.length - 1 }")
                .image(
                    v-else-if="enableImgModals",
                    @click="clickFileImage(replyMsg, $event)"
                )
                    img.bubble(:src="replyMsg.File.ThumbnailURL", :class="{ first: index === 0, last: index === group.Messages.length - 1 }")
                div(v-if="replyMsg.Payload === 'carousel' || replyMsg.Payload === 'card'")
                    button.img-button(
                        v-for="action of replyMsg.Actions") {{ action.Title }}
            a.message_file(v-else-if="replyMsg.File && replyMsg.File.Type === 'file'"
                :href="replyMsg.File.URL"
                target="_blank"
                @click="clickFile(replyMsg, $event)")
                span.file
                    .filename(:class="{ 'filename-client': msg.Author === 'client', 'filename-user': msg.Author === 'user' }") {{ replyMsg.File.Name }}
            audio(v-else-if="replyMsg.File && replyMsg.File.Type === 'audio'"  controls="true" :id="`audio-track-${replyMsg.Id}`"
                :src="replyMsg.File.URL",  @play.prevent="listenForAudioEvents(replyMsg)")
            .reply-text {{ getAuthorAndText(msg).text }}

</template>

<script>

export default {
    props: {
        searching: Boolean,
        groups: Array,
        msg: Object,
        enableImgModals: Boolean
    },

    methods: {
        goToMessage(msg) {
            if (!this.searching) {
                return
            }
            document.getElementById('message-'+msg.ReplyToMessageId).scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        },

        getReplyMsg(message) {
            const messages = this.groups.map(group => group.Messages).reduce((result, current) => [...current, ...result]);
            return messages.reduce((result, current) => {
                if (message.ReplyToMessageId === current.Id) {
                    result.push(current)
                    return result
                }
                return result
            }, []);
        },

        getAuthorAndText(message) {
            const messages = this.groups.map(x => x.Messages).reduce((x, acc) => [...acc, ...x]);
            const msg = messages.find(msg => message.ReplyToMessageId === msg.Id);
            if (msg) {
                return {
                    author: msg.Author === 'client' ? 'Вы' : msg.User.DisplayName,
                    text: msg.Text
                }
            } else return {
                author: '',
                text: ''
            };
        },

        sendMessage(messageText, botpressPayload, url) {
            this.$emit("send-message", messageText, botpressPayload, url)
        },

        clickFile(msg, event) {
            this.$emit("click-file", msg, event);
        },

        clickFileImage(msg) {
            this.$emit("click-file-image", msg);
        },

        listenForAudioEvents() {
            this.$emit("listen-audio", msg)
        }
    }
}

</script>
