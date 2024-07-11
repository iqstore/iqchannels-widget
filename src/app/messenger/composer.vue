<style lang="scss" scoped>
.composer {
    width: 100%;
    height: 80%;
    display: flex;
    flex-direction: column;
    margin: auto;
    padding: 10px 0;

    &-inputs {
        display: flex;
        gap: 6px;
        align-items: center;
        justify-content: center;

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
        width: 80%;
        position: relative;
        border: 2px solid #EBEBEB;
        border-radius: 10px;

        &-title {
            position: absolute;
            padding: 5px;
            color: #767B81;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
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
    fill: #ffffff;
    background: #EBEBEB;
    display: flex;
    min-width: 32px;
    height: 32px;

    &.button-active {
        background-color: #456b84;

        &:hover {
            background-color: rgba(69, 107, 132, 0.7);
        }
    }

    svg {
        width: 18px;
        height: 18px;
        margin: auto;
    }

    &:hover,
    &:active {
        background-color: #dddddd;
    }
}

.upload {
    background: none;
    color: #dddddd;

    &:hover,
    &:active {
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
    border-left: 1px solid #456b84;
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

.upload_file {
    flex-direction: row;
    display: flex;
    white-space: nowrap;
    font-size: 13px;
    margin: 10px 14px 10px 45px;

    &__data {
        display: flex;

        svg {
            width: 24px !important;
            height: 24px !important;
            opacity: 25%;
            margin-right: 5px !important;
        }
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

.csm-btn {
    min-width: 35px;
}

.audio-msg-track {
    float: none;
    overflow: hidden;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    align-items: center;
    padding: 6px 14px 6px 6px;
    height: 36px;
    margin-left: 5px;
    border-radius: 18px;
    background-color: #aeb7c2;
}

.audio-msg-track--btn {
    -ms-flex-negative: 0;
    flex-shrink: 0;
    -webkit-box-ordinal-group: 2;
    -ms-flex-order: 1;
    order: 1;
    border: 0;
    padding: 0;
    border-radius: 50%;
    display: block;
    cursor: pointer;
    width: 24px;
    height: 24px;
    float: left;
    background: url(data:image/svg+xml;charset=utf-8,%3Csvg%20height%3D%2211%22%20viewBox%3D%220%200%2010%2011%22%20width%3D%2210%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22m2.5.5v9l7-4.5z%22%20fill%3D%22%23fff%22%2F%3E%3C%2Fsvg%3E) no-repeat center;
}

.audio-msg-track-btn-stop {
    -ms-flex-negative: 0;
    flex-shrink: 0;
    -webkit-box-ordinal-group: 2;
    -ms-flex-order: 1;
    order: 1;
    border: 0;
    padding: 0;
    border-radius: 50%;
    display: block;
    cursor: pointer;
    margin-right: 5px;
    width: 24px;
    height: 24px;
    float: left;
    background: white url(data:image/svg+xml;charset=utf-8,%3Csvg%20height%3D%2224%22%20viewBox%3D%2262%200%2024%2024%22%20width%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%3E%3Cpath%20d%3D%22m74%2024c6.6%200%2012-5.4%2012-12s-5.4-12-12-12-12%205.4-12%2012%205.4%2012%2012%2012z%22%20fill%3D%22none%22%2F%3E%3Crect%20fill%3D%22%23e2593e%22%20height%3D%228%22%20rx%3D%221%22%20width%3D%228%22%20x%3D%2270%22%20y%3D%228%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E) no-repeat center;
}

.audio-msg-player {
    color: inherit;
}

.image {
    text-decoration: none;
    color: black;

    img {
        vertical-align: middle;
        width: 100%;
        height: 200px;
        object-fit: contain;
    }
}

.audio-msg-track--wave-wrapper {
    width: 250px;
}

.waveform {
    margin-left: 5px;
}

.disabled {
    opacity: 0.4;
    pointer-events: none;
}

.filename {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>

<template lang="pug">
.composer

    .operator-typing(v-if="typingDisplay") {{inputTyping.User.DisplayName }} печатает...

    .replayed(v-if="msg && msgVisible")
        .replayed__data
            .replayed-author {{ author }}
            div(v-if="msg.Payload === 'carousel' && !msg.File")
                pre.text()
                button.img-button(
                    v-for="action of msg.Actions", @click.prevent="trySendMessage(action.Title, action.Payload, action.URL)" ) {{ action.Title }}
            div(v-else-if="msg.File && msg.File.Type == 'image'")
                a.image(
                    :href="msg.File.URL",
                    target="_blank",
                    @click="clickFile(msg, $event)")
                    img.bubble(:src="msg.File.ThumbnailURL")
                div(v-if="msg.Payload === 'carousel' || msg.Payload === 'card'")
                    button.img-button(v-for="action of msg.Actions", @click.prevent="trySendMessage(action.Title, action.Payload, action.URL)" ) {{ action.Title }}
            div(v-else-if="msg.File && msg.File.Type == 'file'")
                a.file(
                    :href="msg.File.URL"
                    target="_blank"
                    @click="clickFile(msg, $event)")
                    span.filename {{ msg.File.Name }}
                    .filesize {{ humanSize(msg.File.Size) }}
            audio(v-else-if="msg.File && msg.File.Type === 'audio'"  controls="true" :id="`audio-track-${msg.Id}`"
                :src="msg.File.URL",  @play.prevent="listenForAudioEvents(msg)")
            .replayed-text {{ msg.Text }}
        svg(width='9' height='9' viewbox='0 0 9 9' fill='none' xmlns='http://www.w3.org/2000/svg' @click="resetReplayedMsg()")
            path(d='M8.79063 0.209373C8.65653 0.0753116 8.47467 0 8.28505 0C8.09543 0 7.91357 0.0753116 7.77947 0.209373L4.5 3.48884L1.22053 0.209373C1.08643 0.0753116 0.904572 0 0.714952 0C0.525332 0 0.343475 0.0753116 0.209373 0.209373C0.0753116 0.343475 0 0.525332 0 0.714952C0 0.904572 0.0753116 1.08643 0.209373 1.22053L3.48884 4.5L0.209373 7.77947C0.0753116 7.91357 0 8.09543 0 8.28505C0 8.47467 0.0753116 8.65653 0.209373 8.79063C0.343475 8.92469 0.525332 9 0.714952 9C0.904572 9 1.08643 8.92469 1.22053 8.79063L4.5 5.51116L7.77947 8.79063C7.91357 8.92469 8.09543 9 8.28505 9C8.47467 9 8.65653 8.92469 8.79063 8.79063C8.92469 8.65653 9 8.47467 9 8.28505C9 8.09543 8.92469 7.91357 8.79063 7.77947L5.51116 4.5L8.79063 1.22053C8.92469 1.08643 9 0.904572 9 0.714952C9 0.525332 8.92469 0.343475 8.79063 0.209373Z' fill='#456b84')

    .upload_container(v-if="currentFiles.length > 0")
        .upload_files(v-for="file in currentFiles")
            upload-file(:current-file="file", @reset-upload="resetUploadFile")

    .composer-inputs(:class="{'disabled': disableFreeText}")
        input.hidden(type="file" ref="uploadInput" @change="uploadFile" multiple)
        a.button.csm-btn(id="record-cancel" v-if="recording || recordingStopped" @click="cancelRecording()", style="cursor:pointer")
            svg(xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512")
                path(d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z")
        a.button.upload(id="upload-btn" v-if="!recording && !recordingStopped", href="#" @click.prevent="$refs.uploadInput.click()" title="Загрузить файл")
            span.icon
        .audio-msg-track(style="width:100%;" v-show="recording || recordingStopped")
            button.audio-msg-track--btn(aria-label="Воспроизвести" v-if="recordingStopped" @click="playAudio()")
            button.audio-msg-track-btn-stop(aria-label="Стоп", v-if="recording && !recordingStopped" @click="stopRecording()")
            div(id="waveform")
        .textarea(v-if="!recording && !recordingStopped")
            textarea(id="message-textarea" ref="text", placeholder="Сообщение..." style="resize: none;" @keydown.enter="handleEnterPressed" :disabled="disableFreeText" @input="handleChange" @paste.prevent="paste")
        a.button.csm-btn(ref="sendMsg" id="send-msg-btn" href="#" @click.prevent="trySendMessage" title="Отправить сообщение" :class="getClass()")
            svg(xmlns="http://www.w3.org/2000/svg" height="16" width="10" viewBox="0 0 320 512")
                path(d="M318 177.5c3.8-8.8 2-19-4.6-26l-136-144C172.9 2.7 166.6 0 160 0s-12.9 2.7-17.4 7.5l-136 144c-6.6 7-8.4 17.2-4.6 26S14.4 192 24 192H96l0 288c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32l0-288h72c9.6 0 18.2-5.7 22-14.5z")
        template(v-if="audioMsgEnabled")
            a.button.csm-btn(id="record-start" v-if="textTyped === '' && !recording && !recordingStopped" @click="startRecording()")
                svg(xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512")
                    path(d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z")
        a.button.upload(id="upload-btn" v-if="!recording && !recordingStopped", href="#" @click.prevent="$refs.uploadInput.click()" title="Загрузить файл")
            span.icon
        .audio-msg-track(style="width:100%;" v-show="recording || recordingStopped")
            button.audio-msg-track--btn(aria-label="Воспроизвести" v-if="recordingStopped" @click="playAudio()")
            button.audio-msg-track-btn-stop(aria-label="Стоп", v-if="recording && !recordingStopped" @click="stopRecording()")
            div(id="waveform")
        .textarea(v-if="!recording && !recordingStopped")
            textarea(id="message-textarea" ref="text", placeholder="Сообщение..." style="resize: none;" @keydown.enter="handleEnterPressed" :disabled="disableFreeText" @input="handleChange" @paste.prevent="paste")
        a.button.csm-btn(ref="sendMsg" id="send-msg-btn" href="#" @click.prevent="trySendMessage" title="Отправить сообщение" :class="getClass()")
            svg(xmlns="http://www.w3.org/2000/svg" height="16" width="10" viewBox="0 0 320 512")
                path(d="M318 177.5c3.8-8.8 2-19-4.6-26l-136-144C172.9 2.7 166.6 0 160 0s-12.9 2.7-17.4 7.5l-136 144c-6.6 7-8.4 17.2-4.6 26S14.4 192 24 192H96l0 288c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32l0-288h72c9.6 0 18.2-5.7 22-14.5z")
        div(v-if="audioMsgEnabled")
            a.button.csm-btn(id="record-start" v-if="textTyped === '' && !recording && !recordingStopped" @click="startRecording()")
                svg(xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512")
                    path(d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z")

</template>
<script>
let WaveSurfer;
let lamejs;
let MicrophonePlugin;

import client from '../../client';
import { humanSize } from '../../lib/filters';
import UploadFile from "../components/upload-file.vue";
const TYPING_INTERVAL = 2000;
const TEXTAREA_HEIGHT = '32px';

export default {
    components: { UploadFile },
    data: function () {
        return {
            lastTypingEventAt: 0,
            lastTypedAt: 0,
            typing: false,
            playRecordedAudio: false,
            audioChunks: [],
            ws: null,
            textTyped: "",
            audioMsgEnabled: true,
            recordingStopped: false,
            mediaRecorder: null,
            recording: false,
            titleVisible: true,
            msgVisible: false,
            typingVisible: false,
            timer: null,
            currentFiles: [],
        };
    },

    props: {
        replayedMsg: Object,
        operatorTyping: Object,
        disableFreeText: Boolean,
        channel: String
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

    created() {
        import(/* webpackChunkName: "wavesurfer" */ 'wavesurfer.js').then(module => {
            WaveSurfer = module.default;
        });
        import(/* webpackChunkName: "lamejs" */ 'lamejs').then(module => {
            lamejs = module.default;
        });
        import(/* webpackChunkName: "wavesurfer" */ "wavesurfer.js/dist/plugin/wavesurfer.microphone.min.js").then(module => {
            MicrophonePlugin = module.default;
        })
    },

    mounted() {
        this.timer = setInterval(this.tryStopTyping, TYPING_INTERVAL);
        client.checkIfAudioMsgEnabled(this.channel).then(r => {
            this.audioMsgEnabled = r.Data;
        });
        this.audioMsgEnabled = false;
        const textareas = document.querySelectorAll('.textarea-field');
        textareas.forEach(textarea => {
            textarea.addEventListener('keypress', (e) => {
                if (e.keyCode === 13 && !e.shiftKey) {
                    e.preventDefault();
                    this.trySendMessage();
                }
            });
        });
    },

    beforeUnmount() {
        clearInterval(this.timer);
        if (this.typing) this.stopTyping();
    },

    methods: {
        humanSize,
        trySendFile() {
            if (!this.currentFiles.length) {
                this.$refs.uploadInput.click()
            } else {
                this.trySendMessage();
            }
        },
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
        loadWs() {
            if (!WaveSurfer || !MicrophonePlugin || !lamejs) {
                return;
            }
            this.ws = WaveSurfer.create({
                container: "#waveform",
                waveColor: "#FFFFFF",
                cursorWidth: 0,
                barWidth: 5,
                barGap: 2,
                barMinHeight: 2,
                barHeight: 3,
                height: 25,
                normalize: true,
                hideScrollbar: true,
                plugins: [
                    MicrophonePlugin.create(),
                ]
            });

            this.ws.microphone.on("deviceReady", (stream) => {

                this.mediaRecorder = new MediaRecorder(stream);

                this.mediaRecorder.ondataavailable = (e) => {
                    this.audioChunks.push(e.data);
                    this.ws.loadBlob(new Blob(this.audioBitsPerSecond));
                };

                this.mediaRecorder.onstop = () => {
                    this.ws.loadBlob(new Blob(this.audioChunks));
                };

                this.mediaRecorder.start(250);
            });

            this.ws.microphone.on("deviceError", (code) => {
                console.warn("Device error: " + code);
            });

        },
        startRecording() {
            this.recording = true;
            this.audioChunks = [];
            if (this.ws) {
                this.ws.destroy();
            }
            setTimeout(() => {
                this.loadWs();
                this.ws.microphone.start();
                this.ws.microphone.play();
            }, 100);
            this.$refs.sendMsg.focus();

        },
        stopRecording() {
            if (!this.ws) {
                return;
            }
            this.ws.microphone.stop();
            this.mediaRecorder && this.mediaRecorder.state !== "inactive" && this.mediaRecorder.stop();
            this.recording = false;
            this.recordingStopped = true;
            this.$refs.sendMsg.focus();

        },
        cancelRecording() {
            if (!this.ws) {
                return;
            }
            this.ws.microphone.stop();
            this.mediaRecorder && this.mediaRecorder.state !== "inactive" && this.mediaRecorder.stop();
            this.recording = false;
            this.audioChunks = [];
            this.recordingStopped = false;
        },
        playAudio() {
            if (!this.ws) {
                return;
            }
            this.ws.play();
            this.ws.setVolume(1);
        },
        analyzeAudioBuffer(aBuffer) {
            let numOfChan = aBuffer.numberOfChannels,
                btwLength = aBuffer.length * numOfChan * 2 + 44,
                btwArrBuff = new ArrayBuffer(btwLength),
                btwView = new DataView(btwArrBuff),
                btwChnls = [],
                btwIndex,
                btwSample,
                btwOffset = 0,
                btwPos = 0;
            setUint32(0x46464952); // "RIFF"
            setUint32(btwLength - 8); // file length - 8
            setUint32(0x45564157); // "WAVE"
            setUint32(0x20746d66); // "fmt " chunk
            setUint32(16); // length = 16
            setUint16(1); // PCM (uncompressed)
            setUint16(numOfChan);
            setUint32(aBuffer.sampleRate);
            setUint32(aBuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
            setUint16(numOfChan * 2); // block-align
            setUint16(16); // 16-bit
            setUint32(0x61746164); // "data" - chunk
            setUint32(btwLength - btwPos - 4); // chunk length

            for (btwIndex = 0; btwIndex < aBuffer.numberOfChannels; btwIndex++)
                btwChnls.push(aBuffer.getChannelData(btwIndex));

            while (btwPos < btwLength) {
                for (btwIndex = 0; btwIndex < numOfChan; btwIndex++) {
                    // interleave btwChnls
                    btwSample = Math.max(-1, Math.min(1, btwChnls[btwIndex][btwOffset])); // clamp
                    btwSample =
                        (0.5 + btwSample < 0 ? btwSample * 32768 : btwSample * 32767) | 0; // scale to 16-bit signed int
                    btwView.setInt16(btwPos, btwSample, true); // write 16-bit sample
                    btwPos += 2;
                }
                btwOffset++; // next source sample
            }

            let wavHdr = lamejs.WavHeader.readHeader(new DataView(btwArrBuff));

            //Stereo
            let data = new Int16Array(btwArrBuff, wavHdr.dataOffset, wavHdr.dataLen / 2);
            let leftData = [];
            let rightData = [];
            for (let i = 0; i < data.length; i += 2) {
                leftData.push(data[i]);
                rightData.push(data[i + 1]);
            }
            const left = new Int16Array(leftData);
            const right = new Int16Array(rightData);

            //STEREO
            if (wavHdr.channels === 2)
                return this.bufferToMp3(wavHdr.channels, wavHdr.sampleRate, left, right);
            //MONO
            else if (wavHdr.channels === 1)
                return this.bufferToMp3(wavHdr.channels, wavHdr.sampleRate, data);

            function setUint16(data) {
                btwView.setUint16(btwPos, data, true);
                btwPos += 2;
            }

            function setUint32(data) {
                btwView.setUint32(btwPos, data, true);
                btwPos += 4;
            }
        },
        bufferToMp3(channels, sampleRate, left, right = null) {
            const buffer = [];
            const samplesPerFrame = 1152;
            const mp3enc = new lamejs.Mp3Encoder(channels, sampleRate, 128);
            let remaining = left.length;
            let mp3buf = [];

            for (let i = 0; remaining >= samplesPerFrame; i += samplesPerFrame) {
                if (!right) {
                    let mono = left.subarray(i, i + samplesPerFrame);
                    mp3buf = mp3enc.encodeBuffer(mono);
                } else {
                    let leftChunk = left.subarray(i, i + samplesPerFrame);
                    let rightChunk = right.subarray(i, i + samplesPerFrame);
                    mp3buf = mp3enc.encodeBuffer(leftChunk, rightChunk);
                }
                if (mp3buf.length > 0) {
                    buffer.push(mp3buf); //new Int8Array(mp3buf));
                }
                remaining -= samplesPerFrame;
            }
            const d = mp3enc.flush();
            if (d.length > 0) {
                buffer.push(new Int8Array(d));
            }

            return new Blob(buffer, { type: 'audio/mpeg' });
        },

        getClass() {
            return {
                'button-active': !this.titleVisible || this.currentFiles.length
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

        trySendMessage(actionTitle, payload, url) {
            if (this.disableFreeText) {
                return;
            }
            if (this.audioChunks.length > 0) {
                this.sendAudioMessage();
                return;
            }
            if (url && url !== "") {
                window.open(url, "_blank")
                return;
            }
            if (!this.$refs.text.value?.length && !this.currentFiles.length) return;
            const messageText = this.$refs.text.value
                .replace(/[\r\n]{2,}/g, "\n")
                .replace(/^[\s]+|[\s]+$/gm, "");
            if (messageText || this.currentFiles.length > 0) {
                this.stopTyping();
                this.scrollToLastMessage();
                if (this.currentFiles.length > 0) {
                    if (this.msgVisible && this.msg) {
                        this.$emit("file-selected", this.currentFiles, messageText, this.msg.Id);
                    } else {
                        this.$emit("file-selected", this.currentFiles, messageText, null);
                    }
                } else if (this.msg && this.msgVisible) {
                    this.$emit("message-composed", { messageText, replyToMessageId: this.msg.Id, payload: payload });
                } else {
                    this.$emit("message-composed", { messageText, payload: payload });
                }
                this.resetReplayedMsg();
                this.resetUploadFiles();
            }
            this.$refs.text.value = "";
            this.titleVisible = true;
        },

        sendAudioMessage() {
            if (!this.ws) {
                return;
            }
            this.ws.microphone.stop();
            this.mediaRecorder && this.mediaRecorder.state !== "inactive" && this.mediaRecorder.stop();
            this.recording = false;
            this.recordingStopped = false;
            setTimeout(() => {
                const mp3Blob = this.analyzeAudioBuffer(this.ws.backend.buffer);
                this.$emit("file-selected", [mp3Blob], "", null);
                this.audioChunks = [];
            }, 100);
        },

        handleChange() {
            const messageText = this.$refs.text.value
                .replace(/[\r\n]{2,}/g, "\n")
                .replace(/^[\s]+|[\s]+$/gm, "");
            this.titleVisible = !(this.$refs.text.value && messageText);
            this.textTyped = messageText;

            this.resizeTextarea();

            this.startTyping();
        },

        resizeTextarea() {
            const target = this.$refs.text;

            target.style.height = TEXTAREA_HEIGHT;
            target.style.height = (target.scrollHeight) + "px";
        },

        focusInput() {
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
            const files = Array.from(this.$refs.uploadInput.files).slice(0, 10);
            this.currentFiles = [...this.currentFiles, ...files].slice(0, 10);
            this.$refs.text.focus();
        },

        resetUploadFile(file) {
            this.currentFiles = this.currentFiles.filter(e => e.name !== file.name);
            if (this.currentFiles.length === 0) {
                this.$refs.uploadInput.value = "";
            }
        },

        resetUploadFiles() {
            this.currentFiles = [];
            this.$refs.uploadInput.value = "";
        },

        paste(pasteEvent) {
            if (!pasteEvent.clipboardData) return;

            const { type, data } = this.getClipboardData(pasteEvent)

            switch (type) {
                case "text": this.$refs.text.value += data;
                    this.handleChange();
                    break;
                case "image":
                    this.currentFiles.push(data);
                    break;
                default: break;
            }
        },

        getClipboardData(pasteEvent) {
            let data = pasteEvent.clipboardData.getData("text")
            if (data && data.length) return { type: "text", data };

            data = pasteEvent.clipboardData.files[0]
            if (data) return { type: "image", data };

            return { type, data }
        }

    }
};
</script>
