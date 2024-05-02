<template lang="pug">
pre.text(v-html="displayText()", @click.prevent="scrollToMessage(msg, $event)")
</template>
<script>
import linkifyString from "linkify-string";
import markdownit from "markdown-it";

export default {
  props: {
    msg: Object
  },
  methods: {
    linkifyText(text) {
      return linkifyString(text, {target: '_blank'});
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
      switch (this.msg.Style) {
        case "html":
          return this.msg.Text;
        case "markdown":
          return this.transformMarkdown(this.msg.Text);
        default:
          return this.linkifyText(this.msg.Text)
      }
    },
    scrollToMessage(msg,event) {
      this.$emit("scroll-to-message", msg, event);
    },
  }
}
</script>
