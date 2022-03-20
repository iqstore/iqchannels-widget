<style lang="sass" scoped>
    .composer {
        width: 100%;
        height: 80%;
        display: flex;
        flex-direction: column;
        margin: auto;
        padding: 10px 0;

        &-inputs {
          display: flex;
          width: 100%;
        }

        textarea {
            position: absolute;
            background-color: transparent;
            padding: 8px 32px 8px 8px;
            border: 0;
            width: 100%;
            height: 100%;
            outline: none;
            color: #000000;
            -moz-box-sizing: border-box;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            float: right;
            clear: both;

        }

        .textarea {
          background: #F2F3F5;
          width: 100%;
          position: relative;
          border: 2px solid #EBEBEB;
          border-radius: 10px;

          &-title {
            position: absolute;
            padding: 8px;
            color: #767B81;
            -webkit-touch-callout:none;
            -webkit-user-select:none;
            -khtml-user-select:none;
            -moz-user-select:none;
            -ms-user-select:none;
            user-select:none;
            -webkit-tap-highlight-color:rgba(0,0,0,0);
          }

          &-field {
            outline: none;
            padding: 8px;
            max-height: 70px;
            overflow-y: scroll;
          }
        }
    }

    .button {
        border-radius: 50%;
        color: #ffffff;
        background: #EBEBEB;
        display: flex;
        min-width: 30px;
        height: 30px;
        margin: 5px 10px 5px;
        align-self: end;

        &.button-active {
          background-color: #DCF5C0;

          &:hover {
            background-color: #DCF5C0;
          }
        }

        svg {
              width: 18px;
              height: 18px;
              margin: auto;
          }

          &:hover, &:active {
           background-color: #dddddd;
          }
    }

    .upload {
      background: none;
      color: #dddddd;

      &:hover, &:active {
        background: none;
        color: #CECECE;
      }

      svg {
        width: 30px;
        height: 30px;


      }
    }

    .hidden {
        display: none;
    }

    .replayed {
      flex-direction: row;
      display: flex;
      white-space: nowrap;
      border-left: 1px solid #C6E39F;
      padding-left: 10px;
      font-size: 13px;
      margin: 10px 16px 10px 52px;

      &__data {
        flex-direction: column;
        display: flex;
        width: 90%;
      }

      &-text {
        text-overflow: ellipsis;
        overflow: hidden;
      }

      &-author {
        font-weight: 600;
      }

      svg {
        width: 12px;
        height: 12px;
        margin: auto 2px auto auto;
      }
    }

    .operator-typing {
      color: #CECECE;
      font-size: 14px;
      margin-left: 70px;
      margin-bottom: 5px;
    }

</style>

<template lang="pug">
    .composer

        .operator-typing(v-if="typingDisplay") {{ inputTyping.User.DisplayName }} печатает...

        .replayed(v-if="msg && msgVisible")
          .replayed__data
            .replayed-author {{ author }}
            .replayed-text {{ msg.Text }}
          svg(width='9' height='9' viewbox='0 0 9 9' fill='none' xmlns='http://www.w3.org/2000/svg' @click="resetReplayedMsg()")
            path(d='M8.79063 0.209373C8.65653 0.0753116 8.47467 0 8.28505 0C8.09543 0 7.91357 0.0753116 7.77947 0.209373L4.5 3.48884L1.22053 0.209373C1.08643 0.0753116 0.904572 0 0.714952 0C0.525332 0 0.343475 0.0753116 0.209373 0.209373C0.0753116 0.343475 0 0.525332 0 0.714952C0 0.904572 0.0753116 1.08643 0.209373 1.22053L3.48884 4.5L0.209373 7.77947C0.0753116 7.91357 0 8.09543 0 8.28505C0 8.47467 0.0753116 8.65653 0.209373 8.79063C0.343475 8.92469 0.525332 9 0.714952 9C0.904572 9 1.08643 8.92469 1.22053 8.79063L4.5 5.51116L7.77947 8.79063C7.91357 8.92469 8.09543 9 8.28505 9C8.47467 9 8.65653 8.92469 8.79063 8.79063C8.92469 8.65653 9 8.47467 9 8.28505C9 8.09543 8.92469 7.91357 8.79063 7.77947L5.51116 4.5L8.79063 1.22053C8.92469 1.08643 9 0.904572 9 0.714952C9 0.525332 8.92469 0.343475 8.79063 0.209373Z' fill='#C6E39F')

        .composer-inputs
            input.hidden(type="file" ref="uploadInput" @change="uploadFile")

            a.button.upload(href="#" @click.prevent="$refs.uploadInput.click()" title="Загрузить файл")
              icon(name="paperclip")

            .textarea
              .textarea-title(v-show="titleVisible" @click="focusInput") Сообщение
              .textarea-field(contenteditable="true" title="Сообщение" role="textbox" @input="handleChange" ref="text")

            a.button(href="#" @click.prevent="trySendMessage" title="Отправить сообщение" v-bind:class="getClass()")
                icon(name="long-arrow-up")


</template>

<script>
const TYPING_INTERVAL = 2000;

export default {
  data: function() {
    return {
      lastTypingEventAt: 0,
      lastTypedAt: 0,
      typing: false,
      titleVisible: true,
      msgVisible: false,
      typingVisible: false,
      timer: null
    };
  },

  props: {
    replayedMsg: Object,
    operatorTyping: Object
  },

  computed: {
    msg: function () {
      return this.replayedMsg;
    },

    author: function () {
      return this.msg ? this.msg.User && this.msg.User.DisplayName ? this.msg.User.DisplayName : 'Вы' : '';
    },

    inputTyping: function () {
      return this.operatorTyping;
    },

    typingDisplay: function () {
      return this.typingVisible && this.operatorTyping && this.operatorTyping.Type === 'typing' && this.operatorTyping.Actor === 'user';
    }
  },

  watch: {
    msg: function () {
      this.focusInput();
    },

    replayedMsg: function (msg) {
      this.msgVisible = true;
      this.focusInput();
    },

    inputTyping: function () {
      this.typingVisible = true;

      setTimeout(() => {
        this.typingVisible = false;
      }, 2500);
    }
  },

  mounted() {
    this.timer = setInterval(this.tryStopTyping, TYPING_INTERVAL);

    $('.textarea-field').keypress(x => {
      if (x.keyCode === 13) {
        x.preventDefault();
        this.trySendMessage();
      }
    });
  },

  beforeDestroy() {
    clearInterval(this.timer);
    if (this.typing) this.stopTyping();
  },

  methods: {
    // Public
    appendText(text) {
      if (!text) {
        return;
      }

      const field = this.$refs.text;

      let v = field.value;
      if (v) {
        v += "\n" + text;
      } else {
        v = text;
      }

      field.value = v;
    },

    getClass() {
      return {
        'button-active': !this.titleVisible
      }
    },

    resetReplayedMsg() {
      this.msgVisible = false;
    },

    // Private

    handleEnterPressed(event) {
      if (!event.shiftKey) {
        event.preventDefault();
        this.trySendMessage();
      }
    },

    scrollToLastMessage() {
      const element = document.getElementById('chat');
      setTimeout(() => {
        element.scrollTop = element.scrollHeight;
      });
    },

    trySendMessage() {
      const messageText = this.$refs.text.innerText
        .replace(/[\r\n]{2,}/g, "\n")
        .replace(/^[\s]+|[\s]+$/gm, "");
      if (messageText) {
        this.stopTyping();
        this.scrollToLastMessage();
        if (this.msg && this.msgVisible) {
          this.$emit("message-composed", { messageText, replyToMessageId: this.msg.Id });
        } else {
          this.$emit("message-composed", messageText);
        }
        this.resetReplayedMsg();
      }
      this.$refs.text.innerText = "";
      this.titleVisible = true;
    },

    handleChange(event) {
      const messageText = this.$refs.text.innerText
          .replace(/[\r\n]{2,}/g, "\n")
          .replace(/^[\s]+|[\s]+$/gm, "");
      this.titleVisible = !(this.$refs.text && messageText);
      this.startTyping();
    },

    focusInput(event) {
      this.$refs.text.focus();
    },

    tryStopTyping() {
      if (this.typing) {
        const idle = new Date().getTime() - this.lastTypedAt;
        if (idle > TYPING_INTERVAL) {
          this.stopTyping();
        }
      }
    },

    stopTyping() {
      this.typing = false;
      this.lastTypingEventAt = 0;
      this.lastTypedAt = 0;
    },

    startTyping() {
      const now = new Date().getTime();
      if (now - this.lastTypingEventAt >= TYPING_INTERVAL) {
        this.lastTypingEventAt = now;
        this.typing = true;
        this.$emit("start-typing");
      }
      this.lastTypedAt = now;
    },

    uploadFile() {
      const file = this.$refs.uploadInput.files[0];
      this.$emit("file-selected", file);
      this.$refs.uploadInput.value = "";
    }
  }
};
</script>
