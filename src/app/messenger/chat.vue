<script>
import avatar from './avatar.vue';
import rating from './rating.vue';
import client from '../../client';
import inforequest from './info-request.vue';
import { humanDate, humanDateTime, humanSize } from '../../lib/filters';
import MessageText from "./message-text.vue";
import messages from './message-list.vue';
import ModalImg from "../components/modal-img.vue";

export default {
    components: { ModalImg, MessageText, inforequest, avatar, rating, messages },

    props: {
        mode: String,
        searching: Boolean,
        opened: Boolean,
        isBottom: Boolean,
        groups: Array,
        rating: Object,
        client: Object,
        channel: String,
        firstUnreadMessageId: Number,
    },

    data: function () {
        return {
            swipeRange: 100,
            showImageModal: false,
            modalImageMsg: null,
            animateMsgIds: {},
            imgModalOptions: {},
        }
    },

    mounted() {
        setTimeout(() => {
            this.scrollToLastMessage();
        }, 1500)
        this.imgModalOptions = this.$parent.$parent.$parent.imgModalOptions;
    },

    updated() {
        this.imgModalOptions = this.$parent.$parent.$parent.imgModalOptions;
    },

    methods: {
        humanSize,
        humanDate,
        humanDateTime,
        scrollToLastMessage() {
            const chat = document.getElementById('chat');
            chat?.scrollTo({
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
            this.$emit("scroll-to-message", msg.Id);
        },
        
        scrollToBottom(event) {
            this.$emit("scroll-to-bottom", event);
        },

        scrollToRating(ratingId, index) {
            this.$emit("scroll-to-rating", ratingId, index);
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
            this.$emit("reply-msg", event);
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
            if (!this.imgModalOptions.enabled) {
                this.$emit("click-file", msg.File);
                return;
            }
            switch (this.imgModalOptions.state) {
                case 'mobile':
                    this.showImageModal = true;
                    this.modalImageMsg = msg;
                    break;
                case 'full':
                    this.$emit("click-file-img", msg);
                    break;
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

        async optionMsgClicked(event) {
            const queryOpts = { name: 'clipboard-read', allowWithoutGesture: false };
            const permissionStatus = await navigator.permissions.query(queryOpts);
            switch (event.option.name) {
                case "Ответить":
                    this.optionClicked(event.item);
                    break;
                case "Копировать":
                    navigator.clipboard.writeText(event.item.Text).catch(err => {
                        console.warn(err.message);
                    });
                    break;
            }
            this.currentMsgContext = null;
        },
    }
};
</script>

<template lang="pug">
    .messages#list(:class="{ 'empty': (groups.length === 0) }")
        modal-img#modal-img(
            @close="closeModalImg",
            @click-file="clickFile",
            :modal-image-msg="modalImageMsg",
            :show-image-modal="showImageModal",
        )

        .no-messages-wrapper(v-if="groups.length === 0")
            span.no-messages Сообщений не найдено

        .group(v-for="group in groups" :class="{ client: group.ClientId, user: group.UserId }" )
            .date(v-if="group.IsNewDay")
                span.title {{ humanDate(group.LastMessage.CreatedAt) }}

            .group-wrapper(v-if="!group.InfoRequest && group.Author !== 'system'")
                .body
                    messages(
                        :searching="searching",
                        :group="group",
                        :groups="groups",
                        :firstUnreadMessageId="firstUnreadMessageId",
                        :animateMsgIds="animateMsgIds",
                        :imgModalOptions="imgModalOptions",
                        @reply-msg="optionClicked",
                        @swipe-rigth="swipeRight",
                        @send-message="trySendMessage",
                        @cancel-upload="cancelUpload",
                        @retry-upload="retryUpload",
                        @click-file="clickFile",
                        @click-file-image="clickFileImage",
                        @listen-audio="listenForAudioEvents",
                        @scroll-to-message="scrollToMessage"
                        @scroll-to-bottom="scrollToBottom")
                div#choices(v-if="group.LastMessage.SingleChoices !== null && !group.LastMessage.IsDropDown", style="margin-top:5px")
                    div
                        div.choice_box_dropdown(v-for="choice in group.LastMessage.SingleChoices")
                            button.choice_button(type="button", style="text-align: center"
                                v-if="!choice.Deleted",
                                @click.prevent="trySendMessage(choice.title, choice.value)") {{ choice.title }}
                div#products.choice_box_dropdown(v-if="group.LastMessage.Payload === 'product'")
                    button.choice_button(type="button", style="margin-top:5px", @click.prevent="acceptProduct(group.LastMessage)")
                        span {{ getProductMsgText(group.LastMessage) }}
                    button.choice_button(type="button", @click.prevent="declineProduct(group.LastMessage)") Отказаться
            rating#rating(
                v-if="group.Rating",
                :rating="group.Rating",
                :client="client",
                :channel="channel",
                @rate-rating="rateRating",
                @ignore-rating="ignoreRating",
                @on-poll-question-chaned="(ratingId, index) => scrollToRating(ratingId, index)")
            inforequest#info-request(
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
        @option-clicked="optionMsgClicked",
    )


</template>

<style lang="scss" scoped>
.messages {
    height: inherit;

    &.empty {
        height: 100%;
    }
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

.no-messages-wrapper {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    .no-messages {
        font-style: italic;
        font-weight: lighter;
        opacity: 60%;
    }
}
</style>
