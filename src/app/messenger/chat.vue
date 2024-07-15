<style lang="scss" scoped>
.messages {
    height: inherit;
}

.date {
    margin: 8px 0 18px 0;
    text-align: center;

    .title {
        padding: 8px 12px;
        border-radius: 16px;
        background-color: #EBEBEB;
        color: #666666;
        font-size: 12px;
    }
}

.group {
    margin-top: 8px;
    margin-bottom: 0;
    padding: 1px 0;
    clear: both;
    width: 100%;

    &.user {
        float: left;

        .message {
            float: left;
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
    }


    &.client {
        float: right;

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

        .group-wrapper {
            justify-content: flex-end;
        }

        audio::-webkit-media-controls-panel,
        video::-webkit-media-controls-panel {
            background-color: #cce4f7;
        }
    }

}

.group-wrapper {
    display: flex;
    flex-flow: column;
}

.body {
    width: 100%;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
}

.choice_box_dropdown {
    margin-left: 58px;
    display: flex;
    font-size: 14px;
    justify-content: flex-start;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 1;
    flex-wrap: wrap;
    text-transform: none;
    visibility: visible;
    text-align: left;
    border-radius: 3px;
}

.choice_button {
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
    --font-family: Roboto;
    -webkit-box-direction: normal;
    outline: none !important;
    width: 84%;
    margin-right: 5px;
    border-radius: 4px;
    text-align: center;
    color: #fff;
    background-color: #ABB8C0;
    border: 1px solid #98A8B2;
    margin-bottom: 5px;
    line-height: 1;
    height: 36px;
    cursor: pointer;
    transition: border 0.3s, background 0.3s, color 0.3s;
}

.backdrop {
    background: black;
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 4;
    opacity: 0.7;
}

.pending {
    z-index: 5;
    position: fixed;
    right: 0;
    left: 0;
    bottom: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 18px;
    color: white;
    height: 100%;

    .modal_img {
        height: 100%;
        display: flex;

        img {
            object-fit: contain;
            width: 100%;
        }
    }

    .modal_img_footer {
        padding: 25px;
    }

    .modal_img_header {
        padding: 15px;
        display: flex;
        border-bottom: 1px gray solid;

        .modal_img_header-icon {
            padding: 10px;

            svg {
                fill: white;
                width: 30px;
                height: 30px;
                transition: 0.3s ease;
                opacity: 0.6;
                cursor: pointer;

                &:hover {
                    opacity: 1;
                }
            }
        }

        .modal_img_header-title {
            margin-left: 10px;
            display: flex;
            flex-flow: column;
            justify-content: space-around;
            width: 100%;

            .modal_img_header-title_date {
                opacity: 0.6;
                font-size: 16px;
            }
        }
    }
}
</style>

<template lang="pug">
.messages
    .backdrop(v-if="showImageModal")
    .pending(v-if="showImageModal")
        .modal_img_header
            .modal_img_header-icon
                svg(@click="closeModalImg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512")
                    path(d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z")
            .modal_img_header-title
                span(v-if="modalImageMsg.Author === 'user'") {{ modalImageMsg.User.DisplayName }}
                span(v-if="modalImageMsg.Author === 'client'") {{ modalImageMsg.Client.Name }}
                span.modal_img_header-title_date {{ humanDateTime(modalImageMsg.CreatedAt) }}
            a(:href="modalImageMsg.File.URL", target="_blank", @click="clickFile(modalImageMsg, $event)")
                .modal_img_header-icon
                    svg(xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512")
                        path(d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z")

        .modal_img
            img(:src="modalImageMsg.File.ThumbnailURL")

        .modal_img_footer(v-if="modalImageMsg.Text")
            span {{ modalImageMsg.Text }}

    .group(v-for="group in groups" :class="{ client: group.ClientId, user: group.UserId }" )
        .date(v-if="group.IsNewDay")
            span.title {{ humanDate(group.LastMessage.CreatedAt) }}

        .group-wrapper(v-if="!group.Rating && !group.InfoRequest && group.Author !== 'system'")
            .body
                messages(
                    :searching="searching",
                    :group="group", 
                    :groups="groups",
                    @swipe-rigth="swipeRight",
                    @send-message="trySendMessage",
                    @click-file="clickFile",
                    @click-file-image="clickFileImage",
                    @listen-audio="listenForAudioEvents",
                    @scroll-to-message="scrollToMessage")
            div(v-if="group.LastMessage.SingleChoices !== null && !group.LastMessage.IsDropDown", style="margin-top:5px")
                div
                    div.choice_box_dropdown(v-for="choice in group.LastMessage.SingleChoices")
                        button.choice_button(type="button", style="text-align: center"
                            v-if="!choice.Deleted",
                            @click.prevent="trySendMessage(choice.title, choice.value)") {{ choice.title }}
            div.choice_box_dropdown(v-if="group.LastMessage.Payload === 'product'")
                button.choice_button(type="button", style="margin-top:5px", @click.prevent="acceptProduct(group.LastMessage)")
                    span {{ getProductMsgText(group.LastMessage) }}
                button.choice_button(type="button", @click.prevent="declineProduct(group.LastMessage)") Отказаться
        rating(
            v-if="group.Rating",
            :rating="group.Rating",
            :client="client",
            :channel="channel",
            @rate-rating="rateRating",
            @ignore-rating="ignoreRating")
        inforequest(
            v-if="group.InfoRequest",
            :request="group.InfoRequest",
            :client="client",
            @send-info="sendInfo",
            @ignore-info="ignoreInfo"
        )

    v-context(
        element-id="msg-context",
        :options=`[
            {name: 'Ответить', class: 'context-menu-option'},
            {name: 'Копировать', class: 'context-menu-option'}
        ]`,
        ref="msgContextMenu",
        @option-clicked="optionClicked",
    )

</template>

<script>
import avatar from './avatar.vue';
import rating from './rating.vue';
import { linkify } from "../../lib/linkify";
import client from '../../client';
import inforequest from './info-request.vue';
import { humanDate, humanDateTime, humanSize } from '../../lib/filters';
import MessageText from "./message-text.vue";
import messages from './message-list.vue';

export default {
    components: { MessageText, inforequest, avatar, rating, messages },

    props: {
        mode: String,
        searching: Boolean,
        opened: Boolean,
        isBottom: Boolean,
        groups: Array,
        rating: Object,
        client: Object,
        channel: String,
    },

    data: function () {
        return {
            swipeRange: 100,
            showImageModal: false,
            modalImageMsg: null,
            animateMsgIds: {},
            enableImgModals: Boolean,
        }
    },

    mounted() {
        setTimeout(() => {
            this.scrollToLastMessage();
        }, 1500)
        this.enableImgModals = this.$parent.$parent.$parent.enableImgModals;
    },

    updated() {
        this.enableImgModals = this.$parent.$parent.$parent.enableImgModals;
    },

    methods: {
        humanSize,
        humanDate,
        humanDateTime,
        scrollToLastMessage() {
            const chat = document.getElementById('chat');
            chat.scrollTo({
                top: chat.scrollHeight,
                behavior: 'smooth'
            });
        },

        trySendMessage(messageText, botpressPayload, url) {
            if (url) {
                window.open(url, "_blank")
                return;
            }
            if (messageText) {
                this.scrollToLastMessage();
                if (this.msg && this.msgVisible) {
                    this.$emit("message-composed", {
                        messageText,
                        replyToMessageId: this.msg.Id,
                        botpressPayload: botpressPayload
                    });
                } else {
                    this.$emit("message-composed", messageText, botpressPayload);
                }
            }
            this.titleVisible = true;
        },

        isTextPayload(payload) {
            return payload === 'text' || payload === 'single-choice' || payload === 'product' || payload === 'link'
        },

        scrollToMessage(msg, event) {
            if (event.target.href) {
                window.open(event.target.href, "_blank")
                return;
            }
            if (!this.searching) {
                return;
            }
            this.$emit("scrollToMessage", msg.Id);
        },

        getProductMsgText(message) {
            const product = message.Product;
            let res = "";
            if (!product) {
                return "";
            }
            if (product.Type === 'product') {
                res = "Подключить продукт "
            } else {
                res = "Подключить услугу "
            }
            if (product.PeriodicPayment === 'free') {
                res = res + "бесплатно";
                return res;
            }
            switch (product.PeriodicPaymentType) {
                case "day":
                    res = res + "за " + product.PeriodicPaymentPrice + " руб/день";
                    return res;
                case "week":
                    res = res + "за " + product.PeriodicPaymentPrice + " руб/неделю";
                    return res;
                case "month":
                    res = res + "за " + product.PeriodicPaymentPrice + " руб/месяц";
                    return res;
                case "year":
                    res = res + "за " + product.PeriodicPaymentPrice + "/год";
                    return res;
            }
        },

        acceptProduct(msg) {
            const product = msg.Product;
            if (product) {
                client.acceptProductMessage(msg.Id, product.Id);
            }
        },

        declineProduct(msg) {
            const product = msg.Product;
            if (product) {
                client.declineProductMessage(msg.Id, product.Id);
            }
        },

        listenForAudioEvents(msg) {
            if (msg.My) {
                return;
            }
            const elId = "audio-track-" + msg.Id;
            const track = document.getElementById(elId);
            // listen for ended event and set listened flag
            track.onended = () => {
                if (!msg.Listened) {
                    msg.Listened = true;
                    client.channelMessagesListen(msg.Id)
                }
            };
        },

        animateMsgAfterScroll(msgId) {
            this.animateMsgIds[+msgId] = true;
            setTimeout(() => {
                delete this.animateMsgIds[+msgId];
            }, 5000);
        },



        optionClicked(event) {
            switch (event.option.name) {
                case "Ответить":
                    this.$emit("reply-msg", event.item);
                    break;
                case "Копировать":
                    navigator.clipboard.writeText(event.item.Text);
                    break;
            }
        },

        swipeRight(event, item) {
            const eventType = event.changedPointers[0].type;
            const closest = event.target.closest('.message-wrapper');

            if (eventType === 'pointerup') {
                this.resetSwipeRight(closest);
            } else {
                const done = event.deltaX < this.swipeRange ? event.deltaX : this.swipeRange;

                if (done < 15) {
                    event.preventDefault();
                    return;
                }

                closest.style.transform = `translateX(${done}px)`;

                if (done >= this.swipeRange) {
                    this.$emit("reply-msg", item);
                    this.resetSwipeRight(closest);
                }
            }
        },

        resetSwipeRight(closest) {
            setTimeout(() => {
                closest.style.transform = 'none';
            }, 100);
        },

        getIcon(msg) {
            const splittedPath = msg.File.Path.split(".");
            const fileType = splittedPath[splittedPath.length - 1];

            if (fileType.includes("doc")) return ['fas', 'fa-file-word'];
            if (fileType.includes("xls")) return ['fas', 'fa-file-excel'];
            if (fileType.includes("pdf")) return ['fas', 'fa-file-pdf'];

            return ['fas', 'fa-file'];
        },

        cancelUpload(localId) {
            this.$emit("cancel-upload", localId);
        },

        retryUpload(localId) {
            this.$emit("retry-upload", localId);
        },

        rateRating(rating) {
            this.$emit("rate-rating", rating);
        },

        ignoreRating(rating) {
            this.$emit("ignore-rating", rating);
        },

        sendInfo(info) {
            this.$emit("send-info", info)
        },

        ignoreInfo(info) {
            this.$emit('ignore-info', info)
        },

        mobileRating(rating) {
            this.$emit('mobile-rating', rating);
        },

        clickFile(msg, event) {
            let file = msg.File;

            if (!file) {
                return;
            }
            if (!event) {
                return;
            }
            if (this.mode !== 'mobile') {
                return;
            }

            event.preventDefault();
            this.$emit("click-file", file);
        },

        clickFileImage(msg) {
            if (this.enableImgModals) {
                this.showImageModal = true;
                this.modalImageMsg = msg;
            }
        },

        closeModalImg() {
            this.showImageModal = false;
            this.modalImageMsg = null;
        },

        downloadModalImg(msg) {
            let file = msg.File;

            this.$emit("download-file", file);
        },

        clickLink(url, event, text) {
            if (!text) {
                return;
            }

            if (!event) {
                return;
            }

            if (this.mode !== 'mobile') {
                return;
            }

            if (!event.target.href) {
                return;
            }

            event.preventDefault();
            this.$emit("click-file", { href: event.target.href });
        },

        linkifyText(text) {
            return linkify(text);
        }
    }
};
</script>
