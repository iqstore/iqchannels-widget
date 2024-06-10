<template lang="pug">
  pre.text(v-html="displayText()", @click.prevent="scrollToMessage(msg, $event)")
</template>
<script>
import markdownit from "markdown-it";
import { linkify } from "../../lib/linkify";

export default {
  props: {
    msg: Object
  },

  methods: {
    transformMarkdown(text) {
      const md = markdownit({
        html: true,
        linkify: true,
        typographer: true
      })
      return md.render(text);
    },

    displayText() {
      switch (true) {
        case this.msg.Style === "html":
          return this.msg.Text;
        case this.msg.Style === "markdown":
          return this.transformMarkdown(this.msg.Text);
        default:
          return linkify(this.msg.Text);
      }
    },

    scrollToMessage(msg, event) {
      this.$emit("scroll-to-message", msg, event);
    },
  }
}
</script>
