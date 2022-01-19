<style lang="sass" scoped>
    .messages {
        padding: 0 8px;
        height: inherit;
        overflow-y: scroll;
    }

    .message {
        margin-bottom: 4px;
        padding: 0.7rem 1rem 0.7rem 1rem;
        clear: both;
        max-width: 75%;

        &.no-p {
            padding: 0 !important;
        }

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
            img {
                vertical-align: middle;
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
            padding:  0.7rem 1rem 0.7rem 1rem;
            border-radius: 16px;
            background-color: #e0f3f8;
            color: #666666;
        }
    }

    .author {
        font-size: 13px;
        color: #333333;
        margin-bottom: 5px;
        white-space: nowrap;
    }

    .received, .read {
        color: #6887ff;
    }

    .read {
        margin-left: -4px;
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
                color: #666666;
            }

            .bubble {
                border-radius: 3px 16px 16px 3px;
                &.first {
                    border-top-left-radius: 16px;
                }
                &.last {
                    border-bottom-left-radius: 16px;
                }
            }

            .time {
                text-align: left;
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
                background-color: #d4f8ba;
                color: #488445;
            }

            .bubble {
                border-radius: 16px 3px 3px 16px;
                &.first {
                    border-top-right-radius: 16px;
                }
                &.last {
                    border-bottom-right-radius: 16px;
                }
            }

            .time {
                text-align: right;
            }
        }
    }

    .time {
        font-weight: 200;
        font-size: 10px;
        color: #666666;
        margin-bottom: 5px;
        white-space: nowrap;
        clear: both;
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
        float: left;
        height: 0;
    }

    .body {
        padding-left: 48px;
    }

</style>

<template lang="pug">
    .messages
        .group(v-for="group in groups" v-bind:class="{ client: group.ClientId, user: group.UserId }")
            .date(v-if="group.IsNewDay")
                span.title {{ group.LastMessage.CreatedAt | humanDate }}

            .avatar(v-if="group.User")
                avatar(v-bind:user="group.User")

            .body(v-if="!group.Rating")
                .author
                    strong {{ group.User && group.User.Name || group.Client && group.Client.Name }}

                .message.bubble(
                    v-for="(msg, index) in group.Messages",
                    :class="{ sending: !msg.Id, first: index === 0, last: index === group.Messages.length - 1, 'no-p': msg.File && msg.File.Type == 'image'  }")


                    pre.text(v-if="msg.Payload == 'text'" v-html="linkifyText(msg.Text)")

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
                    a.image(v-else-if="msg.File && msg.File.Type == 'image'"
                        v-bind:href="msg.File.URL"
                        target="_blank",
                        @click="clickFile(msg, $event)")
                        img.bubble(:src="msg.File.ThumbnailURL", :class="{ first: index === 0, last: index === group.Messages.length - 1 }")
                    a.file(v-else-if="msg.File && msg.File.Type == 'file'"
                        v-bind:href="msg.File.URL"
                        target="_blank"
                        @click="clickFile(msg, $event)")
                        .filename {{ msg.File.Name }}
                        .filesize {{ msg.File.Size | humanSize }}

                .time
                    span(v-if="group.LastMessage.Id") {{ group.LastMessage.CreatedAt.toTimeString().slice(0, 5) }}
                    span.received(v-if="group.LastMessage.Id && group.LastMessage.Received" title="Доставлено") ✓
                    span.read(v-if="group.LastMessage.Id && group.LastMessage.Read" title="Прочитано") ✓
                    scale-loader.loader(v-if="!group.LastMessage.Id" title="Отправляется" color="#999999" height="8px" width="1px")

            rating(
                v-if="group.Rating",
                v-bind:rating="group.Rating",
                @rate-rating="rateRating",
                @ignore-rating="ignoreRating")

</template>

<script>
import { smoothScroll } from "../../lib/scroll";
import avatar from "./avatar.vue";
import rating from "./rating.vue";
import linkifyString from 'linkify-string';

export default {
  components: { avatar, rating },

  props: {
    mode: String,
    opened: Boolean,
    groups: Array
  },

  mounted() {
    this.scrollToLastMessage();
    window.addEventListener("resize", this.scrollToLastMessage);
  },

  updated() {
    this.scrollToLastMessage(false);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.scrollToLastMessage);
  },

  methods: {
    scrollToLastMessage(immediately = true) {
      const container = $(".messages");
      smoothScroll(container, immediately || !this.opened ? 0 : 300);
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

    clickFile(msg, event) {
        let file = msg.File;

        if (!file) {
            return;
        }
        if (!event) {
            return;
        }
        if (this.mode != 'mobile') {
            return;
        }

        event.preventDefault();
        this.$emit("click-file", file);
    },

    linkifyText(text) {
      return linkifyString(text);
    }
  }
};
</script>
