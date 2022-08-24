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
            background-color: transparent;
            padding: 8px 32px 8px 8px;
            border: 0;
            width: 100%;
            outline: none;
            color: #000000;
            -moz-box-sizing: border-box;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            float: right;
            clear: both;
            height: 34px

        }

        .textarea {
          background: #F2F3F5;
          width: 100%;
          position: relative;
          border: 2px solid #EBEBEB;
          border-radius: 10px;

          &-title {
            position: absolute;
            padding: 5px;
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
            padding: 5px;
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
        min-width: 32px;
        height: 32px;
        margin: auto 8px 3px;
        align-self: end;

        &.button-active {
          background-color: #C6E39F;

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

      span.icon {
        background-image: url("data:image/svg+xml,%3Csvg width='17' height='18' viewBox='0 0 17 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.43702 16.2455C-0.479372 14.3001 -0.478955 11.1901 1.43796 9.24518L9.65045 1.08805C11.1704 -0.386923 13.6064 -0.358735 15.0914 1.15101C16.552 2.63592 16.552 5.00742 15.0914 6.49233L7.65487 13.8787C6.68812 14.839 5.12066 14.839 4.1539 13.8787C3.18714 12.9185 3.18714 11.3616 4.1539 10.4013L11.2671 3.33607C11.5239 3.08964 11.9333 3.09672 12.1814 3.35188C12.4235 3.60079 12.4235 3.99539 12.1814 4.24431L5.06826 11.3095C4.61638 11.7781 4.63249 12.5217 5.10418 12.9705C5.56162 13.4058 6.28308 13.4058 6.74052 12.9705L14.177 5.58413C15.1673 4.58629 15.1557 2.97994 14.1511 1.99628C13.1567 1.02256 11.5593 1.02256 10.5648 1.99628L2.35232 10.1534C0.888941 11.6064 0.888524 13.9626 2.35133 15.4161C3.81414 16.8696 6.18631 16.87 7.64968 15.4171L15.8622 7.25988C16.0945 6.99046 16.5027 6.95907 16.774 7.18981C17.0452 7.42055 17.0768 7.82602 16.8445 8.09544C16.8228 8.12058 16.7993 8.14399 16.774 8.16552L8.56146 16.3227C6.57267 18.2555 3.38292 18.221 1.43702 16.2455Z' fill='%23CECECE'/%3E%3C/svg%3E%0A");
        width: 25px;
        height: 26px;
        background-size: cover;
        margin: auto;
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
      margin: 10px 14px 10px 52px;

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
              span.icon

            .textarea
              textarea(ref="text" placeholder="Сообщение..." @keydown.enter="handleEnterPressed" @input="handleChange")

            a.button(href="#" @click.prevent="trySendMessage" title="Отправить сообщение" v-bind:class="getClass()")
                icon(name="long-arrow-up")


</template>

<script>
const TYPING_INTERVAL = 2000;
const TEXTAREA_HEIGHT = '32px';

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
      if (x.keyCode === 13 && !x.shiftKey) {
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
      this.handleChange();
    },

    getClass() {
      return {
        'button-active': !this.titleVisible
      }
    },

    resetReplayedMsg() {
      this.msgVisible = false;
      this.$refs.text.style.height = TEXTAREA_HEIGHT;
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
      const messageText = this.$refs.text.value
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
      this.$refs.text.value = "";
      this.titleVisible = true;
    },

    handleChange(event) {
      const messageText = this.$refs.text.value
          .replace(/[\r\n]{2,}/g, "\n")
          .replace(/^[\s]+|[\s]+$/gm, "");
      this.titleVisible = !(this.$refs.text.value && messageText);

      const target = this.$refs.text;

      target.style.height = TEXTAREA_HEIGHT;
      target.style.height = (target.scrollHeight)+"px";

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
