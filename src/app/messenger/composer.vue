<style lang="sass" scoped>
    .composer {
        width: 100%;
        height: 100%;
        background-color: #f0f0f0;

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
    }

    .button {
        height: 20px;
        width: 24px;
        margin: 4px 4px 0 4px;
        padding-top: 4px;
        text-align: center;
        font-size: 13px;
        border-radius: 4px;
        color: #666666;

        position: relative;
        float: right;
        clear: both;
        display: table-cell;
        vertical-align: middle;

        svg {
            width: 16px;
            height: 16px;
        }

        &:hover, &:active {
         background-color: #dddddd;
        }
    }

    .hidden {
          display: none;
    }
</style>

<template lang="pug">
    .composer
        textarea(ref="text" placeholder="Сообщение..." @keydown.enter="handleEnterPressed" @input="handleChange")
        input.hidden(type="file" ref="uploadInput" @change="uploadFile")
        a.button(href="#" @click.prevent="trySendMessage" title="Отправить сообщение")
            icon(name="send")
        a.button(href="#" @click.prevent="$refs.uploadInput.click()" title="Загрузить файл")
            icon(name="paperclip")

</template>

<script>
const TYPING_INTERVAL = 2000;

export default {
  data: function() {
    return {
      lastTypingEventAt: 0,
      lastTypedAt: 0,
      typing: false,
      timer: null
    };
  },

  mounted() {
    this.timer = setInterval(this.tryStopTyping, TYPING_INTERVAL);
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

    // Private

    handleEnterPressed(event) {
      if (!event.shiftKey) {
        event.preventDefault();
        this.trySendMessage();
      }
    },

    trySendMessage() {
      const messageText = this.$refs.text.value
        .replace(/[\r\n]{2,}/g, "\n")
        .replace(/^[\s]+|[\s]+$/gm, "");
      if (messageText) {
        this.stopTyping();
        this.$emit("message-composed", messageText);
      }
      this.$refs.text.value = "";
    },

    handleChange(event) {
      this.startTyping();
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
