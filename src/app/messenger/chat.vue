<style lang="sass" scoped>
    .messages {
        padding: 0 8px;
        height: inherit;
    }

    .message {
        margin-bottom: 4px;
        padding: 0.7rem 1rem 0.7rem 1rem;
        clear: both;
        max-width: 75%;
        border-radius: 10px;
        display: flex;
        flex-direction: column;

        .text, a {
            white-space: pre-wrap;       /* css-3 */
            white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
            white-space: -pre-wrap;      /* Opera 4-6 */
            white-space: -o-pre-wrap;    /* Opera 7 */
            word-wrap: break-word;       /* Internet Explorer 5.5+ */
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
            color: #488445;
            display: block;
            font-weight: 400;
        }

        .filesize {
            color: #488445;
            margin-top: 8px;
            display: block;
            font-weight: 200;
        }

        .error {
            margin-top: 8px;
        }
    }

    .date {
        margin: 8px 0 18px 0;
        text-align: center;

        .title {
            padding:  8px 12px;
            border-radius: 16px;
            background-color: #EBEBEB;
            color: #666666;
            font-size: 12px;
        }
    }

    .author {
        font-size: 13px;
        color: #333333;
        margin-bottom: 5px;
        white-space: nowrap;
    }

    .received, .read {
        color: #5F814A;
    }

    .read {
        margin-left: -4px;
        position: absolute;
    }

    .received {
        margin-left: 4px;
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
                float: left;
                margin-top: 8px;
            }

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

            .received, .read {
                display: none;
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
                margin-right: 0;
                background-color: #DCF5C0;
                color: #488445;
            }

            .bubble {
                &.last {
                  margin-bottom: 0;
                }
            }

            .group-wrapper {
              justify-content: flex-end;
            }
          audio::-webkit-media-controls-panel, video::-webkit-media-controls-panel {
          background-color: #dcf5c0;
            }
        }
    }

    .group-wrapper {
      display: flex
    }

    .time {
        font-size: 10px;
        color: #5F814A;
        white-space: nowrap;
        clear: both;
        margin: auto 0 0 12px;
        position: relative;
    }

    .sending {
        background-color: rgba(212, 248, 186, 0.4) !important;
    }

    .loader {
        display: inline-block;
        float: right;
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
        width: 35%;
        white-space: nowrap;
        word-break: keep-all;
    }

    .cancel {
        background-color: rgba(255, 0, 0, 0.4);
    }

    .retry {
        background-color: rgba(1, 138, 43, 0.4);
    }

    .avatar {
      margin:auto auto 0;
    }

    .body {
      width: 100%;
      margin-left: 10px;
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

    .reply {
      flex-direction: column;
      display: flex;
      white-space: nowrap;
      border-left: 1px solid #5F814A;
      padding-left: 5px;
      margin-bottom: 5px;
      font-size: 13px;

      &-text {
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }

    .reply-icon {
      position: absolute;
      left: -25px;
    }

    .message-wrapper {
      display: flex;
      transition: all 0.3s;
      font-size: 14px;
    }
    .img-caption{
      font-size: 14px;
      color: black;
      font-family: sans-serif;
      pointer-events: none !important;
      padding-top: 10px;
      padding-bottom: 4px;
    }
    .img-button{
      width: 100%;
      border-radius: 4px;
      height: 32px;
      background-color: #E3E3E3;
      border-width: 1px;
      border-color: #CCCCCC;
      }
    .choice_box_dropdown{
    display: flex;
    font-size: 14px;
    justify-content: flex-start;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 1;
    display: flex;
    flex-wrap: wrap;
    text-transform: none;
    visibility: visible;
    text-align: left;
    border-radius: 3px;
    }
    .choice_button{
      white-space: pre-wrap;       /* css-3 */
      white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
      white-space: -pre-wrap;      /* Opera 4-6 */
      white-space: -o-pre-wrap;    /* Opera 7 */
      word-wrap: break-word;       /* Internet Explorer 5.5+ */
      font-family: inherit;
      font-size: inherit;
      --font-family: Roboto;
      -webkit-box-direction: normal;
      outline: none !important;
      width: 84%;
      margin-right: 5px;
      border-radius: 4px;
      color: #fff;
      background-color: #ABB8C0;
      border: 1px solid #98A8B2;
      margin-bottom: 5px;
      line-height: 1;
      height: 36px;
      cursor: pointer;
      transition: border 0.3s, background 0.3s, color 0.3s;
    }

    .blue{
      color: cornflowerblue;
    }

    .listened-flag{
        position: absolute;
        top: -40px;
        left: 25px;
        cursor: pointer;
        color: #2EB8FE;
    }

    .scroll{
      cursor: pointer;
    }



</style>

<template lang="pug">
    .messages#list
        .group(v-for="group in groups" v-bind:class="{ client: group.ClientId, user: group.UserId }")
            .date(v-if="group.IsNewDay")
                span.title {{ group.LastMessage.CreatedAt | humanDate }}

            .group-wrapper

              .avatar(v-if="group.User")
                avatar(v-bind:user="group.User")

              .body(v-if="!group.Rating")
                .author
                  span(v-if="group.User") {{ group.User.Pseudonym ? group.User.Pseudonym : group.User.Name }}
                  span(v-if="group.Client") {{ group.Client.Name }}
                .message-wrapper(v-for="(msg, index) in group.Messages",
                  v-hammer:pan="(event)=> swipeRight(event, msg)",
                  :id="msg.Id")

                  .message.bubble(
                    v-touch:longtap="longtapEvent(msg)",
                    :title="getTitle()",
                    @click.prevent="scrollToMessage(msg)"
                    :class="{scroll: searching, sending: !msg.Id, first: index === 0, last: index === group.Messages.length - 1, 'no-p': msg.File && msg.File.Type == 'image'  }")

                    .reply-icon
                      svg(width='14' height='12' viewbox='0 0 14 12' fill='none' xmlns='http://www.w3.org/2000/svg')
                        path(d='M0.168205 5.31043L5.31015 0.16848C5.67006 -0.191429 6.28546 0.0634719 6.28546 0.572471V2.8604C9.55786 2.99642 12.4442 5.22457 13.359 8.39557C13.6644 9.45406 13.7406 10.3252 13.7166 11.2627C13.7135 11.3728 13.7128 11.4046 13.7128 11.4277C13.7128 12.0082 12.9474 12.2187 12.6505 11.7199C12.014 10.6504 11.291 9.82404 10.4991 9.21322C9.06731 8.10896 7.57668 7.78917 6.28549 7.91831V10.8564C6.28549 11.3654 5.67009 11.6203 5.31018 11.2604L0.168232 6.11841C-0.0549068 5.8953 -0.0549078 5.53354 0.168205 5.31043ZM5.14283 9.47707V7.4284C5.14283 7.16667 5.32068 6.93842 5.57446 6.87441C5.64398 6.85687 5.75946 6.83389 5.91613 6.81198C7.5345 6.58555 9.41461 6.93378 11.1969 8.3084C11.6353 8.64653 12.0529 9.03949 12.4473 9.48957L12.4385 9.44383C12.393 9.20926 12.3346 8.96702 12.2611 8.71231C11.4456 5.88536 8.77869 3.93434 5.82534 3.998C5.77542 3.99888 5.75699 3.99928 5.73388 4.00009C5.41082 4.01123 5.14285 3.75236 5.14285 3.42909V1.95177L1.38021 5.71442L5.14283 9.47707Z' fill='#C6E39F')

                    .reply(v-if="msg.ReplyToMessageId", @click="goToMessage(msg)")
                      .reply-author {{ getAuthorAndText(msg).author }}
                      .reply-text {{ getAuthorAndText(msg).text }}

                    .message-data

                      pre.text(v-if="isTextPayload(msg.Payload)" v-html="linkifyText(msg.Text)" @click="clickLink(msg.Text, $event, linkifyText(msg.Text))")
                      .file.text(v-if="msg.Upload")
                        div(v-if="msg.Uploading")
                          .filename {{ msg.Upload.name }}
                          .filesize {{ msg.Upload.size | humanSize }} - Загружено {{ msg.UploadProgress }}%
                          a.button.cancel(@click.prevent="cancelUpload(msg.LocalId)" href="#") Отмена
                        div(v-if="msg.UploadError")
                          .filename {{ msg.Upload.name }}
                          .filesize {{ msg.Upload.size | humanSize }}
                          .error {{ msg.UploadError }}
                          a.button.cancel(@click.prevent="cancelUpload(msg.LocalId)" href="#") Отмена
                          a.button.retry(@click.prevent="retryUpload(msg.LocalId)" href="#") Повтор
                      div(v-if="msg.Payload === 'carousel' && !msg.File")
                        pre.text(v-html="linkifyText(msg.Text)" @click="clickLink(msg.Text, $event, linkifyText(msg.Text))")
                        button.img-button(
                          v-for="action of msg.Actions", @click.prevent="trySendMessage(action.Title, action.Payload, action.URL)" ) {{ action.Title }}
                      div(v-else-if="msg.File && msg.File.Type == 'image'")
                        a.image(
                        v-bind:href="msg.File.URL",
                        target="_blank",
                        @click="clickFile(msg, $event)")
                          img.bubble(:src="msg.File.ThumbnailURL", :class="{ first: index === 0, last: index === group.Messages.length - 1 }")
                        div.img-caption
                          b {{ msg.Text }}
                        button.img-button(v-if="msg.Payload === 'carousel' || msg.Payload === 'card'",
                          v-for="action of msg.Actions", @click.prevent="trySendMessage(action.Title, action.Payload, action.URL)" ) {{ action.Title }}
                      a.file(v-else-if="msg.File && msg.File.Type == 'file'"
                        v-bind:href="msg.File.URL"
                        target="_blank"
                        @click="clickFile(msg, $event)")
                        .filename {{ msg.File.Name }}
                        .filesize {{ msg.File.Size | humanSize }}
                      audio(v-else-if="msg.File && msg.File.Type === 'audio'"  controls="true" :id="`audio-track-${msg.Id}`"
                        :src="msg.File.URL",  @play.prevent="listenForAudioEvents(msg)")
                      div

                      .time
                        span.listened-flag(v-if="msg.Listened" title="Прослушано")
                          icon(name="headphones")
                        span(v-if="group.LastMessage.Id") {{ group.LastMessage.CreatedAt.toTimeString().slice(0, 5) }}
                        span.received(v-if="group.LastMessage.Id && group.LastMessage" title="Доставлено" :class="{'blue': group.LastMessage.Listened}") ✓
                        span.read(v-if="group.LastMessage.Id && group.LastMessage.Read" title="Прочитано") ✓


                        scale-loader.loader(v-if="!group.LastMessage.Id" title="Отправляется" color="#999999" height="8px" width="1px")
                div(v-if="group.LastMessage.SingleChoices !== null && !group.LastMessage.IsDropDown", style="margin-top:5px")
                  div.choice_box_dropdown
                    div(style="display:flex;justify-content:flex-end")
                    button.choice_button(type="button"
                    v-for="choice in group.LastMessage.SingleChoices",
                    @click.prevent="trySendMessage(choice.title, choice.value)") {{ choice.title }}
                div.choice_box_dropdown(v-if="group.LastMessage.Payload === 'product'")
                  button.choice_button(type="button", style="margin-top:5px", @click.prevent="acceptProduct(group.LastMessage)")
                    span {{ getProductMsgText(group.LastMessage) }}
                  button.choice_button(type="button", @click.prevent="declineProduct(group.LastMessage)") Отказаться
            rating(
                v-if="group.Rating",
                v-bind:rating="group.Rating",
                @rate-rating="rateRating",
                @ignore-rating="ignoreRating")

</template>

<script>
import avatar from './avatar.vue';
import rating from './rating.vue';
import linkifyString from 'linkify-string';
import client from '../../client';

export default {
  components: { avatar, rating },

  props: {
    mode: String,
    searching: Boolean,
    opened: Boolean,
    groups: Array,
    rating: Object,
  },

  data: function () {
    return {
      swipeRange: 100,
      audioMessagePlayingId: null
    }
  },

  mounted() {
    this.scrollToLastMessage();
  },

  methods: {
    scrollToLastMessage() {
      const el = $('#chat');

      el.on('scroll', () => {
        setTimeout(() => {
          const htmlMessages = [].slice.apply(document.getElementsByClassName('message-wrapper'));
          htmlMessages.forEach(transform => transform.style.transform = 'none');
        });
      });

      el.stop().animate({
        scrollTop: el[0].scrollHeight
      }, 800);
    },

    trySendMessage(messageText, botpressPayload, url) {
      if (url){
        window.open(url, "_blank")
      }
      if (messageText) {
        this.scrollToLastMessage();
        if (this.msg && this.msgVisible) {
          this.$emit("message-composed", { messageText, replyToMessageId: this.msg.Id, botpressPayload: botpressPayload });
        } else {
          this.$emit("message-composed", messageText, botpressPayload);
        }
      }
      this.titleVisible = true;
    },

    getAuthorAndText: function(message) {
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

    isTextPayload(payload) {
      return payload === 'text' || payload === 'single-choice' || payload === 'product' || payload === 'link'
    },

    goToMessage(msg) {
      if (!this.searching) {
        return
      }
      document.getElementById(msg.ReplyToMessageId).scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    },

    scrollToMessage(msg) {
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
        if (product.PeriodicPayment === 'free'){
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

    longtapEvent(msg) {
      return (event) => {
        this.$emit("long-tap", msg);
      }
    },

    listenForAudioEvents (msg) {
      if (msg.My) {
        return;
      }
      if (this.audioMessagePlayingId) {
        const playing = document.getElementById(this.audioMessagePlayingId);
        playing.pause();
      }
      const elId = "audio-track-" + msg.Id;
      this.audioMessagePlayingId = elId;
      const track = document.getElementById(elId);
      // listen for ended event and set listened flag
      track.onended = () => {
        if (!msg.Listened) {
          msg.Listened = true;
          client.channelMessagesListen(msg.Id)
        }
      };
    },

    swipeRight(event, item){
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

    getTitle() {
      if (this.searching) {
        return "Перейти к сообщению"
      }
      return "Сообщение"
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
      return linkifyString(text, {target: '_blank'});
    }
  }
};
</script>
