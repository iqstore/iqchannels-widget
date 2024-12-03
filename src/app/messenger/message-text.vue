<script>
import { linkify } from "../../lib/linkify";
import client from '../../client';


export default {
    props: {
        msg: Object,
        md: null,
    },

    methods: {
        transformMarkdown(text) {
            if (!this.md) {
                this.loadMarkdownIt().then(() => {
                    this.md.render(text);
                });
            }
            return this.md.render(text);
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

        async loadMarkdownIt() {
            try {
                const { default: markdownit } = await import(/* webpackChunkName: "markdownit" */ 'markdown-it');
                this.md = markdownit({
                    html: true,
                    linkify: true,
                    typographer: true
                });
            } catch (error) {
                client.logMessage('Failed to load markdown-it:' + error)
            }
        },
    }
}
</script>

<template lang="pug">
    pre.text(v-html="displayText()", @click.prevent="scrollToMessage(msg, $event)")
</template>
