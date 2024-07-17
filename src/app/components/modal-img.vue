<script>
import { humanDateTime } from "../../lib/filters";

export default {
    name: "modal-img",
    props: {
        showImageModal: Boolean,
        modalImageMsg: Object,
    },
    methods: {
        humanDateTime,
        closeModalImg() {
            this.$emit("close");
        }
    }
}
</script>

<template lang="pug">
  .backdrop(v-if="showImageModal")
    .pending(v-if="showImageModal")
        .modal_img_header
            .modal_img_header-icon
                svg(@click="closeModalImg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512")
                    path(d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z")
            .modal_img_header-title
                span(v-if="modalImageMsg.Author === 'user'") {{ modalImageMsg.User.DisplayName }}
                span(v-if="modalImageMsg.Author === 'client'") {{ modalImageMsg.Client.Name }}
                span.modal_img_header-title_date {{ humanDateTime(modalImageMsg.CreatedAt) }}
            a(:href="modalImageMsg.File.URL", target="_blank", @click="clickFile(modalImageMsg, $event)")
                .modal_img_header-icon
                    svg(xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512")
                        path(d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z")

        .modal_img
            img(:src="modalImageMsg.File.ThumbnailURL")

        .modal_img_footer(v-if="modalImageMsg.Text")
            span {{ modalImageMsg.Text }}
</template>

<style scoped lang="scss">
.backdrop {
    background: black;
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 4;
    opacity: 0.7;
}

.pending {
    z-index: 5;
    position: fixed;
    right: 0;
    left: 0;
    bottom: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 18px;
    color: white;
    height: 100%;

    .modal_img {
        height: 100%;
        display: flex;

        img {
            object-fit: contain;
            width: 100%;
        }
    }

    .modal_img_footer {
        padding: 25px;
    }

    .modal_img_header {
        padding: 15px;
        display: flex;
        border-bottom: 1px gray solid;

        .modal_img_header-icon {
            padding: 10px;

            svg {
                fill: white;
                width: 30px;
                height: 30px;
                transition: 0.3s ease;
                opacity: 0.6;
                cursor: pointer;

                &:hover {
                    opacity: 1;
                }
            }
        }

        .modal_img_header-title {
            margin-left: 10px;
            display: flex;
            flex-flow: column;
            justify-content: space-around;
            width: 100%;

            .modal_img_header-title_date {
                opacity: 0.6;
                font-size: 16px;
            }
        }
    }
}
</style>
