<template lang="pug">
  pre.text(v-html="displayText()", @click.prevent="scrollToMessage(msg, $event)")
</template>
<script>
import linkifyString from "linkify-string";
import markdownit from "markdown-it";
import { findPhoneNumbersInText } from 'libphonenumber-js';

export default {
  props: {
    msg: Object
  },

  data: () => ({
    getPhoneNum: [],
  }),

  methods: {
    linkifyText(text) {
      return linkifyString(text, { target: '_blank' });
    },

    telify(origText) {
      let newText = origText;

      if (newText?.length) {
        this.getPhoneNum.forEach((match) => {
          const pattern = origText.substring(match.startsAt, match.endsAt);
          newText = newText.replace(pattern, `<a href="tel:${match.number.number}")>${pattern}</a>`);

        });
      }
      return newText;
    },

    transformMarkdown(text) {
      const md = markdownit({
        html: true,
        linkify: true,
        typographer: true
      })
      return md.render(text);
    },

    displayText() {
      this.getPhoneNum = findPhoneNumbersInText(this.msg.Text);
      switch (true) {
        case this.msg.Style === "html":
          return this.msg.Text;
        case this.msg.Style === "markdown":
          return this.transformMarkdown(this.msg.Text);
        case this.getPhoneNum.length > 0:
          return this.telify(this.msg.Text);
        default:
          return this.linkifyText(this.msg.Text);
      }
    },

    scrollToMessage(msg, event) {
      this.$emit("scroll-to-message", msg, event);
    },
  }
}
</script>
