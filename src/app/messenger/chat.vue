<style lang="scss" scoped>
.messages {
  height: inherit;
}

.message {
  margin: 2px 8px;
  padding: 0.7rem 1rem 0.7rem 1rem;
  clear: both;
  max-width: 75%;
  border-radius: 14px;
  display: flex;
  flex-direction: column;

  .text {
    width: 85%;
  }

  .text, a {
    white-space: pre-wrap; /* css-3 */
    white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
    white-space: pre-wrap; /* Opera 4-6 */
    white-space: -o-pre-wrap; /* Opera 7 */
    word-wrap: break-word; /* Internet Explorer 5.5+ */
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
    display: block;
    font-weight: 700;

    &-client {
      color: #456b84;
    }

    &-user {
      color: #656565;
    }
  }

  .filesize {
    margin-top: 6px;
    display: block;
    font-weight: 200;
    font-size: 12px;

    &-client {
      color: #456b84;
    }

    &-user {
      color: #979797;
    }
  }

  .error {
    margin-top: 8px;
  }
}

.date {
  margin: 8px 0 18px 0;
  text-align: center;

  .title {
    padding: 8px 12px;
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
  color: #456b84;
}

.received, .read {
  margin-left: 5px;
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
      margin-left: 58px;
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

    .body .message-wrapper .message-inner .message .message-data {
      .time {
        color: #656565;
      }
    }

    .body > .message-wrapper {
      &:first-child:not(:only-child) .message-inner .message {
        border-top-left-radius: 14px;
        border-bottom-left-radius: 4px;
      }

      &:last-child:not(:only-child) .message-inner .message {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 14px;
      }

      &:not(:first-child):not(:last-child):not(:only-child) .message-inner .message {
        border-bottom-left-radius: 4px;
        border-top-left-radius: 4px;
      }
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
      background-color: #cce4f7;
      color: #456b84;
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
      background-color: #cce4f7;
    }

    .body .message-wrapper .message-inner .message .message-data {
      .time {
        color: #456b84;
      }
    }

    .body > .message-wrapper {
      &:first-child:not(:only-child) .message-inner .message {
        border-top-right-radius: 14px;
        border-bottom-right-radius: 4px;
      }

      &:last-child:not(:only-child) .message-inner .message {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 14px;
      }

      &:not(:first-child):not(:last-child):not(:only-child) .message-inner .message {
        border-bottom-right-radius: 4px;
        border-top-right-radius: 4px;
      }
    }
  }

  .body > .message-wrapper {
    .message-inner .message:only-child {
      border-radius: 14px;
    }
  }

  .body .message-wrapper .message-inner .message .message-data {
    .time {
      font-size: 10px;
      white-space: nowrap;
      clear: both;
      margin: auto 0 0 12px;
      position: relative;
    }
  }
}

.group-wrapper {
  display: flex;
  flex-flow: column;
}

.message-wrapper .message-inner .sending {
  background-color: rgba(204, 228, 247, 0.4);
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
  white-space: nowrap;
  word-break: keep-all;
}

.cancel {
  background-color: rgba(255, 0, 0, 0.4);
}

.retry {
  background-color: rgba(69, 107, 132, 0.7);
}

.message-inner {
  display: flex;
}

.avatar {
  margin-left: 8px;
  display: flex;
  align-items: end;
}

.avatar-empty {
  width: 40px;
  height: 40px;
  margin-left: 8px;
}

.body {
  width: 100%;
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
  padding-left: 5px;
  margin-bottom: 5px;
  font-size: 13px;

  &-client {
    border-left: 2px solid #456b84;
  }

  &-user {
    border-left: 2px solid black;
  }

  &-text {
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .message_file {
    align-items: center;
  }
}

.reply-icon {
  position: absolute;
  left: -25px;
}

.message-wrapper {
  display: flex;
  flex-flow: column;
  transition: all 0.3s;
  font-size: 14px;
  touch-action: pan-y !important;
}

.img-button {
  width: 100%;
  border-radius: 4px;
  height: 32px;
  background-color: #E3E3E3;
  border-width: 1px;
  border-color: #CCCCCC;
}

.choice_box_dropdown {
  margin-left: 58px;
  display: flex;
  font-size: 14px;
  justify-content: flex-start;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1;
  flex-wrap: wrap;
  text-transform: none;
  visibility: visible;
  text-align: left;
  border-radius: 3px;
}

.choice_button {
  white-space: pre-wrap; /* css-3 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */
  font-family: inherit;
  font-size: inherit;
  --font-family: Roboto;
  -webkit-box-direction: normal;
  outline: none !important;
  width: 84%;
  margin-right: 5px;
  border-radius: 4px;
  text-align: center;
  color: #fff;
  background-color: #ABB8C0;
  border: 1px solid #98A8B2;
  margin-bottom: 5px;
  line-height: 1;
  height: 36px;
  cursor: pointer;
  transition: border 0.3s, background 0.3s, color 0.3s;
}

.blue {
  color: cornflowerblue;
}

.listened-flag {
  position: absolute;
  top: -40px;
  left: 25px;
  cursor: pointer;
  color: #2EB8FE;
}

.edited {
    margin-right: 0.5em;
}

.scroll {
  cursor: pointer;
}

.reply-author {
  margin-bottom: 5px;
  margin-top: 5px;
  font-size: 12px;
  font-weight: 600;

  &-user {
    color: black;
  }

  &-client {
    color: #456b84;
  }
}

.message_file {
  display: flex;
  align-items: center;
  text-decoration: none;

  &-client {
    width: 32px !important;
    height: 32px !important;
    color: #456b84 !important
  }

  &-user {
    width: 32px !important;
    height: 32px !important;
    color: #ABB8C0 !important
  }

  svg {
    margin-right: 5px !important;
  }

  svg.reply-message-file {
    width: 24px !important;
    height: 24px !important;
  }

  svg.message-file {
    width: 32px !important;
    height: 32px !important;
  }
}

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

.scroll_msg_animation_client {
  animation: 2s afterScrollAnimateClient ease-out forwards;
}

.file_state-not_approved {
  text-align: center;

  .rejected {
    color: red;
  }

  .check_error {
    color: red;
  }

  .on_checking {
    color: #2D98F4;
  }

  .sent_for_checking {
    color: #2D98F4;
  }
}

@keyframes afterScrollAnimateClient {
  0% {
    background: none;
  }
  50% {
    background: var(--color-after-scroll-animation_client);
  }
  100% {
    background: none;
  }
}

.scroll_msg_animation_user {
  animation: 2s afterScrollAnimateUser ease-out forwards;
}

@keyframes afterScrollAnimateUser {
  0% {
    background: none;
  }
  50% {
    background: var(--color-after-scroll-animation_user);
  }
  100% {
    background: none;
  }
}

</style>

<template lang="pug">
  .messages#list

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

    .group(v-for="group in groups" :class="{ client: group.ClientId, user: group.UserId }" )
      .date(v-if="group.IsNewDay")
        span.title {{ humanDate(group.LastMessage.CreatedAt) }}

      .group-wrapper(v-if="!group.Rating && !group.InfoRequest && group.Author !== 'system'")
        .body()
          .message-wrapper(v-for="(msg, index) in group.Messages",
            v-hammer:pan="(event) => swipeRight(event, msg)",
            :class="{ scroll_msg_animation_client: msg.My && animateMsgIds[msg.Id], scroll_msg_animation_user: !msg.My && animateMsgIds[msg.Id] }"
            :id="msg.Id")

            .author(v-if="group.Messages[0].Id === msg.Id")
              span(v-if="group.User") {{ group.User.DisplayName }}
              span(v-if="group.Client") {{ group.Client.Name }}

            .message-inner
              .avatar(v-if="group.User && msg.Author === 'user' && group.Messages[group.Messages.length - 1].Id === msg.Id")
                avatar(v-bind:user="group.User")

              .avatar-empty(v-if="group.User && group.Messages[group.Messages.length - 1].Id !== msg.Id")

              .message.bubble(
                v-touch:longtap="longtapEvent(msg)",
                @contextmenu.prevent="($event) => showMsgContext($event, msg)",
                :title="getTitle()",

                :class="{scroll: searching, sending: !msg.Id, first: index === 0, last: index === group.Messages.length - 1, 'no-p': msg.File && msg.File.Type == 'image'  }")

                .reply-icon
                  svg(width='14' height='12' viewbox='0 0 14 12' fill='none' xmlns='http://www.w3.org/2000/svg')
                    path(d='M0.168205 5.31043L5.31015 0.16848C5.67006 -0.191429 6.28546 0.0634719 6.28546 0.572471V2.8604C9.55786 2.99642 12.4442 5.22457 13.359 8.39557C13.6644 9.45406 13.7406 10.3252 13.7166 11.2627C13.7135 11.3728 13.7128 11.4046 13.7128 11.4277C13.7128 12.0082 12.9474 12.2187 12.6505 11.7199C12.014 10.6504 11.291 9.82404 10.4991 9.21322C9.06731 8.10896 7.57668 7.78917 6.28549 7.91831V10.8564C6.28549 11.3654 5.67009 11.6203 5.31018 11.2604L0.168232 6.11841C-0.0549068 5.8953 -0.0549078 5.53354 0.168205 5.31043ZM5.14283 9.47707V7.4284C5.14283 7.16667 5.32068 6.93842 5.57446 6.87441C5.64398 6.85687 5.75946 6.83389 5.91613 6.81198C7.5345 6.58555 9.41461 6.93378 11.1969 8.3084C11.6353 8.64653 12.0529 9.03949 12.4473 9.48957L12.4385 9.44383C12.393 9.20926 12.3346 8.96702 12.2611 8.71231C11.4456 5.88536 8.77869 3.93434 5.82534 3.998C5.77542 3.99888 5.75699 3.99928 5.73388 4.00009C5.41082 4.01123 5.14285 3.75236 5.14285 3.42909V1.95177L1.38021 5.71442L5.14283 9.47707Z' fill='#456b84')
                div(v-if="msg.ReplyToMessageId")
                  .reply(@click="goToMessage(msg)", v-for="replyMsg of getReplyMsg(msg)" :class="{ 'reply-client': msg.Author === 'client', 'reply-user': msg.Author === 'user' }" )
                    .reply-author(:class="{ 'reply-author-client': msg.Author === 'client', 'reply-author-user': msg.Author === 'user' }") {{ getAuthorAndText(msg).author }}
                    div(v-if="replyMsg.Payload === 'carousel' && !replyMsg.File")
                      pre.text()
                      button.img-button(
                        v-for="action of replyMsg.Actions", @click.prevent="trySendMessage(action.Title, action.Payload, action.URL)" ) {{ action.Title }}
                    div(v-else-if="replyMsg.File && replyMsg.File.Type === 'image'")
                      a.image(
                        v-if="!enableImgModals",
                        :href="replyMsg.File.URL",
                        target="_blank",
                        @click="clickFile(replyMsg, $event)"
                      )
                        img.bubble(:src="replyMsg.File.ThumbnailURL", :class="{ first: index === 0, last: index === group.Messages.length - 1 }")
                      .image(
                        v-else-if="enableImgModals",
                        @click="clickFileImage(replyMsg, $event)"
                      )
                        img.bubble(:src="replyMsg.File.ThumbnailURL", :class="{ first: index === 0, last: index === group.Messages.length - 1 }")
                      div(v-if="replyMsg.Payload === 'carousel' || replyMsg.Payload === 'card'")
                        button.img-button(
                          v-for="action of replyMsg.Actions") {{ action.Title }}
                    a.message_file(v-else-if="replyMsg.File && replyMsg.File.Type === 'file'"
                      :href="replyMsg.File.URL"
                      target="_blank"
                      @click="clickFile(replyMsg, $event)")
                      span.file
                        .filename(:class="{ 'filename-client': msg.Author === 'client', 'filename-user': msg.Author === 'user' }") {{ replyMsg.File.Name }}
                    audio(v-else-if="replyMsg.File && replyMsg.File.Type === 'audio'"  controls="true" :id="`audio-track-${replyMsg.Id}`"
                      :src="replyMsg.File.URL",  @play.prevent="listenForAudioEvents(replyMsg)")
                    .reply-text {{ getAuthorAndText(msg).text }}

                .message-data
                  message-text(v-if="isTextPayload(msg.Payload)",
                    v-bind:msg="msg",
                    @scroll-to-message="scrollToMessage")

                  .file.text(v-if="msg.Upload")
                    div(v-if="msg.Uploading")
                      .filename {{ msg.Upload.name }}
                      .filesize {{ humanSize(msg.Upload.size) }} - Загружено {{ msg.UploadProgress }}%
                      a.button.cancel(@click.prevent="cancelUpload(msg.LocalId)" href="#") Отмена
                    div(v-if="msg.UploadError")
                      .filename {{ msg.Upload.name }}
                      .filesize {{ humanSize(msg.Upload.size) }}
                      .error {{ msg.UploadError }}
                      a.button.cancel(@click.prevent="cancelUpload(msg.LocalId)" href="#") Отмена
                      a.button.retry(@click.prevent="retryUpload(msg.LocalId)" href="#") Повтор
                  div(v-if="msg.Payload === 'carousel' && !msg.File")
                    pre.text(v-html="linkifyText(msg.Text)" @click="clickLink(msg.Text, $event, linkifyText(msg.Text))")
                    button.img-button(
                      v-for="action of msg.Actions", @click.prevent="trySendMessage(action.Title, action.Payload, action.URL)" ) {{ action.Title }}
                  div(v-else-if="(msg.File && msg.File.Type === 'image') || msg.Payload === 'card'")
                    a.image(
                      v-if="!enableImgModals && msg.File",
                      :href="msg.File.URL",
                      target="_blank",
                      @click="clickFile(msg, $event)"
                    )
                      img.bubble(v-if="msg.File && msg.File.Type === 'image'" :src="msg.File.ThumbnailURL", :class="{ first: index === 0, last: index === group.Messages.length - 1 }")
                    .image(
                      v-else-if="enableImgModals && msg.File",
                      @click="clickFileImage(msg, $event)"
                    )
                      img.bubble(v-if="msg.File && msg.File.Type === 'image'", :src="msg.File.ThumbnailURL", :class="{ first: index === 0, last: index === group.Messages.length - 1 }")
                    div.img-caption
                      pre.text(v-html="linkifyText(msg.Text)" @click.prevent="scrollToMessage(msg, $event, linkifyText(msg.Text))")
                    div(v-if="msg.Payload === 'carousel' || msg.Payload === 'card'")
                      button.img-button(
                        v-for="action of msg.Actions", @click.prevent="trySendMessage(action.Title, action.Payload, action.URL)" ) {{ action.Title }}
                  div(v-else-if="msg.File && msg.File.Type === 'file'")
                    .file_state-not_approved(v-if="msg.File.State !== 'approved'")
                      .check_error(v-if="msg.File.State === 'check_error'")
                        span Ошибка проверки файла
                      .on_checking(v-if="msg.File.State === 'on_checking'")
                        span Файл на проверке
                      .sent_for_checking(v-if="msg.File.State === 'sent_for_checking'")
                        span Файл отправлен на проверку
                      .rejected(v-if="msg.File.State === 'rejected'")
                        span Небезопасный файл
                    a.message_file(
                      v-else-if="msg.File.State === 'approved'"
                      :href="msg.File.URL"
                      target="_blank"
                      @click="clickFile(msg, $event)")
                      font-awesome-icon(:icon="getIcon(msg)", :class="{ 'message_file-client': msg.Author === 'client', 'message_file-user': msg.Author === 'user' }")
                      span.file
                        .filename(:class="{ 'filename-client': msg.Author === 'client', 'filename-user': msg.Author === 'user' }") {{ msg.File.Name }}
                        .filesize(:class="{ 'filesize-client': msg.Author === 'client', 'filesize-user': msg.Author === 'user' }") {{ humanSize(msg.File.Size) }}
                    div.img-caption(v-if="msg.Text")
                      pre.text(v-html="linkifyText(msg.Text)" @click.prevent="scrollToMessage(msg, $event, linkifyText(msg.Text))")
                  audio(v-else-if="msg.File && msg.File.Type === 'audio'"  controls="true" :id="`audio-track-${msg.Id}`"
                    :src="msg.File.URL",  @play.prevent="listenForAudioEvents(msg)")
                  div

                  .time
                    span.edited(v-if="msg.EditedAt" title="Изменено") изменено
                    span.listened-flag(v-if="msg.Listened" title="Прослушано")
                      svg(xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512")
                        path(d="M256 80C149.9 80 62.4 159.4 49.6 262c9.4-3.8 19.6-6 30.4-6c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48c-44.2 0-80-35.8-80-80V384 336 288C0 146.6 114.6 32 256 32s256 114.6 256 256v48 48 16c0 44.2-35.8 80-80 80c-26.5 0-48-21.5-48-48V304c0-26.5 21.5-48 48-48c10.8 0 21 2.1 30.4 6C449.6 159.4 362.1 80 256 80z")
                    span(v-if="msg.Id && msg.CreatedAt") {{ new Date(msg.CreatedAt).toTimeString().slice(0, 5) }}
                    span.received(v-if="msg.Id && !msg.Read" title="Доставлено" :class="{'blue': msg.Listened}")
                      svg(width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg")
                        path(d="M10.5 1L4 7.5L1 5" stroke="#1C91D2" stroke-opacity="0.64" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round")

                    span.read(v-if="msg.Read" title="Прочитано")
                      svg(width="16" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg")
                        path(d="M10.5 1L4 7.5L1 5" stroke="#1C91D2" stroke-opacity="0.64" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round")
                        path(d="M15 1L8.5 7.5" stroke="#1C91D2" stroke-opacity="0.64" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round")

                    scale-loader.loader(v-if="!msg.Id" title="Отправляется" color="#999999" height="8px" width="1px")
        div(v-if="group.LastMessage.SingleChoices !== null && !group.LastMessage.IsDropDown", style="margin-top:5px")
          div
            div.choice_box_dropdown(v-for="choice in group.LastMessage.SingleChoices")
              button.choice_button(type="button", style="text-align: center"
                v-if="!choice.Deleted",
                @click.prevent="trySendMessage(choice.title, choice.value)") {{ choice.title }}
        div.choice_box_dropdown(v-if="group.LastMessage.Payload === 'product'")
          button.choice_button(type="button", style="margin-top:5px", @click.prevent="acceptProduct(group.LastMessage)")
            span {{ getProductMsgText(group.LastMessage) }}
          button.choice_button(type="button", @click.prevent="declineProduct(group.LastMessage)") Отказаться
      rating(
        v-if="group.Rating",
        :rating="group.Rating",
        :client="client",
        :channel="channel",
        @rate-rating="rateRating",
        @ignore-rating="ignoreRating")
      inforequest(
        v-if="group.InfoRequest",
        :request="group.InfoRequest",
        :client="client",
        @send-info="sendInfo",
        @ignore-info="ignoreInfo"
      )

  v-context(
    element-id="msg-context",
    :options=`[
        {name: 'Ответить', class: 'context-menu-option'},
        {name: 'Копировать', class: 'context-menu-option'}
    ]`,
    ref="msgContextMenu",
    @option-clicked="optionClicked",
  )

</template>

<script>
import avatar from './avatar.vue';
import rating from './rating.vue';
import { linkify } from "../../lib/linkify";
import client from '../../client';
import inforequest from './info-request.vue';
import { humanDate, humanDateTime, humanSize } from '../../lib/filters';
import MessageText from "./message-text.vue";

export default {
  components: { MessageText, inforequest, avatar, rating },

  props: {
    mode: String,
    searching: Boolean,
    opened: Boolean,
    isBottom: Boolean,
    groups: Array,
    rating: Object,
    client: Object,
    channel: String,
  },

  data: function () {
    return {
      swipeRange: 100,
      showImageModal: false,
      modalImageMsg: null,
      animateMsgIds: {},
      enableImgModals: Boolean,
    }
  },

  mounted() {
    setTimeout(() => {
      this.scrollToLastMessage();
    }, 1500)
    this.enableImgModals = this.$parent.$parent.$parent.enableImgModals;
  },

  updated() {
    this.enableImgModals = this.$parent.$parent.$parent.enableImgModals;
  },

  methods: {
    humanSize,
    humanDate,
    humanDateTime,
    scrollToLastMessage() {
      const chat = document.getElementById('chat');
      chat.scrollTo({
        top: chat.scrollHeight,
        behavior: 'smooth'
      });
    },

    trySendMessage(messageText, botpressPayload, url) {
      if (url) {
        window.open(url, "_blank")
        return;
      }
      if (messageText) {
        this.scrollToLastMessage();
        if (this.msg && this.msgVisible) {
          this.$emit("message-composed", {
            messageText,
            replyToMessageId: this.msg.Id,
            botpressPayload: botpressPayload
          });
        } else {
          this.$emit("message-composed", messageText, botpressPayload);
        }
      }
      this.titleVisible = true;
    },

    getAuthorAndText: function (message) {
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

    getReplyMsg: function (message) {
      const messages = this.groups.map(x => x.Messages).reduce((x, acc) => [...acc, ...x]);
      const msg = messages.find(msg => message.ReplyToMessageId === msg.Id);
      if (msg) {
        return [msg];
      } else {
        return [];
      }
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

    scrollToMessage(msg, event) {
      if (event.target.href) {
        window.open(event.target.href, "_blank")
        return;
      }
      if (!this.searching) {
        return;
      }
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
      if (product.PeriodicPayment === 'free') {
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

    listenForAudioEvents(msg) {
      if (msg.My) {
        return;
      }
      const elId = "audio-track-" + msg.Id;
      const track = document.getElementById(elId);
      // listen for ended event and set listened flag
      track.onended = () => {
        if (!msg.Listened) {
          msg.Listened = true;
          client.channelMessagesListen(msg.Id)
        }
      };
    },

    swipeRight(event, item) {
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

    showMsgContext(event, msg) {
      this.$refs.msgContextMenu.showMenu(event, msg);
    },

    animateMsgAfterScroll(msgId) {
      this.animateMsgIds[+msgId] = true;
      setTimeout(() => {
        delete this.animateMsgIds[+msgId];
      }, 5000);
    },

    getTitle() {
      if (this.searching) {
        return "Перейти к сообщению"
      }
      return "Сообщение"
    },

    optionClicked(event) {
      switch (event.option.name) {
        case "Ответить":
          this.$emit("reply-msg", event.item);
          break;
        case "Копировать":
          navigator.clipboard.writeText(event.item.Text);
          break;
      }
    },

    getIcon(msg) {
      const splittedPath = msg.File.Path.split(".");
      const fileType = splittedPath[splittedPath.length - 1];

      if (fileType.includes("doc")) return ['fas', 'fa-file-word'];
      if (fileType.includes("xls")) return ['fas', 'fa-file-excel'];
      if (fileType.includes("pdf")) return ['fas', 'fa-file-pdf'];

      return ['fas', 'fa-file'];
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

    sendInfo(info) {
      this.$emit("send-info", info)
    },

    ignoreInfo(info) {
      this.$emit('ignore-info', info)
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

    clickFileImage(msg, event) {
      if (this.enableImgModals) {
        this.showImageModal = true;
        this.modalImageMsg = msg;
      }
    },

    closeModalImg() {
      this.showImageModal = false;
      this.modalImageMsg = null;
    },

    downloadModalImg(msg) {
      let file = msg.File;

      this.$emit("download-file", file);
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
      return linkify(text);
    }
  }
};
</script>
