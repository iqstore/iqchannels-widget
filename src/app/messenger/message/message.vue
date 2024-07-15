<style lang="scss">
.message {
    margin: 2px 8px;
    padding: 0.7rem 1rem 0.7rem 1rem;
    clear: both;
    max-width: 75%;
    border-radius: 14px;
    display: flex;
    flex-direction: column;

    .text {
        width: 85%;
    }

    .text,
    a {
        white-space: pre-wrap;
        /* css-3 */
        white-space: -moz-pre-wrap;
        /* Mozilla, since 1999 */
        white-space: pre-wrap;
        /* Opera 4-6 */
        white-space: -o-pre-wrap;
        /* Opera 7 */
        word-wrap: break-word;
        /* Internet Explorer 5.5+ */
        font-family: inherit;
        font-size: inherit;
        margin: 0;
    }

    .image {
        text-decoration: none;
        color: black;

        img {
            vertical-align: middle;
            width: 100%;
        }
    }

    .file {
        font-size: 13px;
        text-decoration: none;
    }

    .filename {
        display: block;
        font-weight: 700;

        &-client {
            color: #456b84;
        }

        &-user {
            color: #656565;
        }
    }

    .filesize {
        margin-top: 6px;
        display: block;
        font-weight: 200;
        font-size: 12px;

        &-client {
            color: #456b84;
        }

        &-user {
            color: #979797;
        }
    }

    .error {
        margin-top: 8px;
    }
}

.author {
    font-size: 13px;
    color: #333333;
    margin-bottom: 5px;
    white-space: nowrap;
}

.received,
.read {
    margin-left: 5px;
    color: #456b84;
}


.group {
    margin-top: 8px;
    margin-bottom: 0;
    padding: 1px 0;
    clear: both;
    width: 100%;

    &.user {
        float: left;

        .author {
            margin-top: 8px;
            margin-left: 58px;
        }

        .message {
            background-color: #f3f3f3;
            color: #656565;
        }

        .bubble {
            &.last {
                margin-bottom: 0;
            }
        }

        .received,
        .read {
            display: none;
        }


        .message-inner {
            &:first-child:not(:only-child) .message-inner .message {
                border-top-left-radius: 14px;
                border-bottom-left-radius: 4px;
            }

            &:last-child:not(:only-child) .message-inner .message {
                border-top-left-radius: 4px;
                border-bottom-left-radius: 14px;
            }

            &:not(:first-child):not(:last-child):not(:only-child) .message-inner .message {
                border-bottom-left-radius: 4px;
                border-top-left-radius: 4px;
            }
        }
    }

    &.client {
        float: right;

        .author {
            display: none;
        }

        .message {
            float: right;
            margin-left: auto;
            background-color: #cce4f7;
            color: #456b84;
        }

        .bubble {
            &.last {
                margin-bottom: 0;
            }
        }


        audio::-webkit-media-controls-panel,
        video::-webkit-media-controls-panel {
            background-color: #cce4f7;
        }

        .body>.message-wrapper {
            &:first-child:not(:only-child) .message-inner .message {
                border-top-right-radius: 14px;
                border-bottom-right-radius: 4px;
            }

            &:last-child:not(:only-child) .message-inner .message {
                border-top-right-radius: 4px;
                border-bottom-right-radius: 14px;
            }

            &:not(:first-child):not(:last-child):not(:only-child) .message-inner .message {
                border-bottom-right-radius: 4px;
                border-top-right-radius: 4px;
            }
        }
    }


    .body>.message-wrapper {
        .message-inner .message:only-child {
            border-radius: 14px;
        }
    }
}


.message-wrapper .message-inner .sending {
    background-color: rgba(204, 228, 247, 0.4);
}

.button {
    display: block;
    border-radius: 4px;
    padding: 4px;
    text-align: center;
    text-decoration: none;
    font-size: 13px;
    color: white;
    margin-top: 8px !important;
    margin-right: 8px !important;
    float: left;
    white-space: nowrap;
    word-break: keep-all;
}

.loader {
    display: inline-block;
    float: right;
}

.cancel {
    background-color: rgba(255, 0, 0, 0.4);
}

.retry {
    background-color: rgba(69, 107, 132, 0.7);
}

.message-inner {
    display: flex;
}

.message-wrapper {
    display: flex;
    flex-flow: column;
    transition: all 0.3s;
    font-size: 14px;
    touch-action: pan-y !important;
}

.body {
    width: 100%;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
}

.svg-read {
    left: -6px;
    position: absolute;
    top: 1px;
}

.message-data {
    display: flex;
    justify-content: space-between;
}





.img-button {
    width: 100%;
    border-radius: 4px;
    height: 32px;
    background-color: #E3E3E3;
    border-width: 1px;
    border-color: #CCCCCC;
}


.listened-flag {
    position: absolute;
    top: -40px;
    left: 25px;
    cursor: pointer;
    color: #2EB8FE;
}

.edited {
    margin-right: 0.5em;
}



.message_file {
    display: flex;
    align-items: center;
    text-decoration: none;

    &-client {
        width: 32px !important;
        height: 32px !important;
        color: #456b84 !important
    }

    &-user {
        width: 32px !important;
        height: 32px !important;
        color: #ABB8C0 !important
    }

    svg {
        margin-right: 5px !important;
    }
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
</style>

<template lang="pug">
.author(v-if="group.Messages[0].Id === msg.Id")
    span(v-if="group.User") {{ group.User.DisplayName }}
    span(v-if="group.Client") {{ group.Client.Name }}

.message-inner
    message-avatar(
        v-if="group.User",
        :showEmpty="group.Messages[group.Messages.length - 1].Id !== msg.Id",
        :showAvatar="msg.Author === 'user' && group.Messages[group.Messages.length - 1].Id === msg.Id",
        v-bind:user="group.User"
    )

    .message.bubble(
        v-touch:longtap="longtapEvent(msg)",
        @contextmenu.prevent="($event) => showMsgContext($event, msg)",
        :title="getTitle()",
        :class="{scroll: searching, sending: !msg.Id, first: index === 0, last: index === group.Messages.length - 1, 'no-p': msg.File && msg.File.Type == 'image'  }"
    )

        reply(
            :msg="msg",
            :searching="searching",
            :groups="groups",
            @send-message="sendMessage",
            @click-file="clickFile",
            @click-file-image="clickFileImage"
        )

        .message-data
            message-text(v-if="isTextPayload(msg.Payload)",
            v-bind:msg="msg",
            @scroll-to-message="scrollToMessage")

            .file.text(v-if="msg.Upload")
                div(v-if="msg.Uploading")
                    .filename {{ msg.Upload.name }}
                    .filesize {{ humanSize(msg.Upload.size) }} - Загружено {{ msg.UploadProgress }}%
                    a.button.cancel(@click.prevent="cancelUpload(msg.LocalId)" href="#") Отмена
                div(v-if="msg.UploadError")
                    .filename {{ msg.Upload.name }}
                    .filesize {{ humanSize(msg.Upload.size) }}
                    .error {{ msg.UploadError }}
                    a.button.cancel(@click.prevent="cancelUpload(msg.LocalId)" href="#") Отмена
                    a.button.retry(@click.prevent="retryUpload(msg.LocalId)" href="#") Повтор
            div(v-if="msg.Payload === 'carousel' && !msg.File")
                pre.text(v-html="linkifyText(msg.Text)" @click="clickLink(msg.Text, $event, linkifyText(msg.Text))")
                button.img-button(
                    v-for="action of msg.Actions", @click.prevent="sendMessage(action.Title, action.Payload, action.URL)" ) {{ action.Title }}
            div(v-else-if="(msg.File && msg.File.Type === 'image') || msg.Payload === 'card'")
                a.image(
                    v-if="!enableImgModals && msg.File",
                    :href="msg.File.URL",
                    target="_blank",
                    @click="clickFile(msg, $event)"
                )
                    img.bubble(v-if="msg.File && msg.File.Type === 'image'" :src="msg.File.ThumbnailURL", :class="{ first: index === 0, last: index === group.Messages.length - 1 }")
                .image(
                    v-else-if="enableImgModals && msg.File",
                    @click="clickFileImage(msg)"
                )
                    img.bubble(v-if="msg.File && msg.File.Type === 'image'", :src="msg.File.ThumbnailURL", :class="{ first: index === 0, last: index === group.Messages.length - 1 }")
                div.img-caption
                    pre.text(v-html="linkifyText(msg.Text)" @click.prevent="scrollToMessage(msg, $event, linkifyText(msg.Text))")
                div(v-if="msg.Payload === 'carousel' || msg.Payload === 'card'")
                    button.img-button(
                        v-for="action of msg.Actions", @click.prevent="sendMessage(action.Title, action.Payload, action.URL)" ) {{ action.Title }}
            div(v-else-if="msg.File && msg.File.Type === 'file'")
                .file_state-not_approved(v-if="msg.File.State !== 'approved'")
                    .check_error(v-if="msg.File.State === 'check_error'")
                        span Ошибка проверки файла
                    .on_checking(v-if="msg.File.State === 'on_checking'")
                        span Файл на проверке
                    .sent_for_checking(v-if="msg.File.State === 'sent_for_checking'")
                        span Файл отправлен на проверку
                    .rejected(v-if="msg.File.State === 'rejected'")
                        span Небезопасный файл
                a.message_file(
                    v-else-if="msg.File.State === 'approved'"
                    :href="msg.File.URL"
                    target="_blank"
                    @click="clickFile(msg, $event)")
                    font-awesome-icon(:icon="getIcon(msg)", :class="{ 'message_file-client': msg.Author === 'client', 'message_file-user': msg.Author === 'user' }")
                    span.file
                        .filename(:class="{ 'filename-client': msg.Author === 'client', 'filename-user': msg.Author === 'user' }") {{ msg.File.Name }}
                        .filesize(:class="{ 'filesize-client': msg.Author === 'client', 'filesize-user': msg.Author === 'user' }") {{ humanSize(msg.File.Size) }}
                div.img-caption(v-if="msg.Text")
                    pre.text(v-html="linkifyText(msg.Text)" @click.prevent="scrollToMessage(msg, $event, linkifyText(msg.Text))")
            audio(v-else-if="msg.File && msg.File.Type === 'audio'"  controls="true" :id="`audio-track-${msg.Id}`"
                :src="msg.File.URL",  @play.prevent="listenForAudioEvents(msg)")

            time(
                :msg="msg"
            )

</template>

<script>

import MessageText from "../message-text.vue";
import messageAvatar from "./message-avatar.vue";
import reply from "./reply.vue";
import time from "./time.vue"


export default {
    components: { MessageText, messageAvatar, reply, time },

    props: {
        searching: Boolean,
        group: Object,
        groups: Array,
        msg: Object
    },

    methods: {
        getTitle() {
            if (this.searching) {
                return "Перейти к сообщению"
            }
            return "Сообщение"
        },

        showMsgContext(event, msg) {
            this.$refs.msgContextMenu.showMenu(event, msg);
        },

        sendMessage(messageText, botpressPayload, url) {
            this.$emit("send-message", messageText, botpressPayload, url)
        },

        longtapEvent(msg) {
            return () => {
                this.$emit("long-tap", msg);
            }
        },

        isTextPayload(payload) {
            return payload === 'text' || payload === 'single-choice' || payload === 'product' || payload === 'link'
        },

        clickFile(msg, event) {
            this.$emit("click-file", msg, event);
        },

        clickFileImage(msg) {
            this.$emit("click-file-image", msg);
        },

        listenForAudioEvents() {
            this.$emit("listen-audio", msg)
        },

        scrollToMessage(msg, event) {
            this.$emit("scroll-to-message", msg, event)
        }
    }

}

</script>