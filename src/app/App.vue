<script>
import config from '../config';
import { clearCookie } from '../lib/web';
import client from '../client';
import { provide, ref, watch } from "vue";
import ErrorBoundary from "./components/error-boundary.vue";

export default {
    name: 'app',
    components: { ErrorBoundary },

    computed: {
        'stylesURL': function () {
            return config.apiUrl('/widget/styles.css?channel=' + this.channel);
        }
    },

    setup() {
        let appError = ref(null);

        const onClose = () => parent.postMessage({ type: 'iqchannels-widget-close' }, '*');
        const onMessageReceived = () => parent.postMessage({ type: 'iqchannels-widget-message' }, '*');
        const onFileClicked = (url) => parent.postMessage({ type: 'iqchannels-widget-file', data: url }, '*');
        const onUnreadChanged = (count) => parent.postMessage({ type: 'iqchannels-widget-unread', data: count }, '*');
        const onLongTap = (msg) => parent.postMessage({
            type: 'iqchannels-widget-longtap',
            data: JSON.stringify(msg)
        }, '*');
        const onRating = (rating) => parent.postMessage({ type: 'iqchannels-widget-rating', data: rating }, '*');
        const onError = (error) => {
            if (!error) {
                appError.value = null;
            } else appError.value = error;

            parent.postMessage({ type: 'iqchannels-error', data: JSON.stringify(error) }, "*");
        };

        provide('client', client);

        watch(
            () => client.state.error,
            (newError) => {
                onError(newError);
            }
        );

        return {
            onClose,
            onMessageReceived,
            onFileClicked,
            onUnreadChanged,
            onLongTap,
            onRating,
            onError,

            appError,
        }
    },

    data() {
        return {
            initialized: false,
            mode: 'web', // web'\'mobile'
            opened: false,
            closeSystemChat: false,
            channel: null,
            credentials: null,
            greetings: null,
            personalDataForm: null,
            personalDataFormReady: false,
            project: null,
            requireName: true,
            client: null,
            pushToken: null,
            replayedMsg: null,
            scrollToMsg: null,
            rating: null,
            enableImgModals: null,
            chats: null,
            isMultipleChats: false,
            multiClient: null,
        };
    },

    mounted() {
        window.addEventListener('message', (e) => {
            const { type, data } = e;
            if (type !== 'message') {
                return;
            }

            let event = data.length ? JSON.parse(data) : data;
            switch (event.type) {
                case 'init':
                    this.initialized = true;
                    this.mode = event.data.mode ? event.data.mode : 'web';
                    this.channel = event.data.channel;
                    this.credentials = event.data.credentials;
                    this.project = event.data.project;
                    this.requireName = event.data.requireName ?? true;
                    this.pushToken = event.data.pushToken;
                    this.enableImgModals = event.data.enableImgModals;
                    this.chats = event.data.chats;
                    this.isMultipleChats = event.data.isMultipleChats;

                    this.maybeSendPushToken();
                    this.getGreetings();
                    client.version().then(version => {
                        client.iQVersion = version?.Data?.Version;
                    });
                    break;

                case 'close':
                    this.opened = false;
                    break;

                case 'open':
                    this.opened = true;
                    break;

                case 'logout':
                    this.onLogout();
                    break;

                case 'append_text':
                    const edata = event.data;
                    if (!edata) {
                        return;
                    }

                    const text = edata.text;
                    if (!text) {
                        return;
                    }

                    if (this.isMultipleChats) {
                        this.$refs.multiMessenger.appendText(text);
                    } else {
                        this.$refs.messenger.appendText(text);
                    }
                    break;

                case 'push_token':
                    const tdata = event.data;
                    if (!tdata) {
                        return;
                    }

                    this.pushToken = tdata;
                    this.maybeSendPushToken();
                    break;

                case 'refresh_client':
                    this.refreshClient();
                    break;

                case 'reply-message':
                    this.replayedMsg = event.data;
                    break;
                case 'scroll-to-message':
                    this.scrollToMsg = event.data;
                    break;
                case 'get-rating':
                    this.rating = event.data;
                    break;

                case 'close-system-chat':
                    this.closeSystemChat = true;
                    break;
            }
        });
    },

    methods: {
        onClientChanged(event) {
            this.client = event.Client
        },

        onLogin(client) {
            this.client = client;
            this.maybeSendPushToken();
        },

        onMultiLogin(multiClient) {
            this.multiClient = multiClient;
        },

        onFailedLogin() {
            parent.postMessage({ type: 'iqchannels-ready' }, "*");
        },

        onMessagesLoaded() {
            parent.postMessage({ type: 'iqchannels-ready' }, "*");
        },

        onLogout() {
            clearCookie(config.CLIENT_SESSION_COOKIE);
            this.credentials = null;
            this.project = null;
            this.client = null;
            this.multiClient = null;

            client.clearAuth();
        },

        maybeSendPushToken() {
            if (!this.client && !this.multiClient) {
                return;
            }
            if (!this.pushToken) {
                return;
            }

            const tdata = this.pushToken;
            client.channelPushToken(this.channel, tdata.type, tdata.token);
        },

        refreshClient() {
            if (!this.client) {
                return;
            }
            if (!this.credentials) {
                return;
            }

            client.refreshClient(this.credentials);
        },
        getGreetings() {
            client.getWidgetGreetingsWithRequestType(this.channel).then(res => {
                this.greetings = {
                    Greeting: res.Data?.Greeting,
                    GreetingBold: res.Data?.GreetingBold
                };
                switch (res.Data?.PersonalDataRequestType) {
                    case 'none':
                        this.personalDataFormReady = true;
                        this.requireName = false;
                        break;
                    case 'default':
                        this.personalDataFormReady = true;
                        this.requireName = true;
                        break;
                    case 'full_form':
                        this.requireName = true;
                        this.getPersonalDataForm()
                        break;
                    default:
                        this.personalDataFormReady = true;
                }
            });
        },
        getPersonalDataForm() {
            client.getWidgetPersonalDataForm(this.channel).then(res => {

                this.personalDataForm = {
                    State: 'pending',
                    Form: res.Data
                };
                this.personalDataFormReady = true;
            });
        },
    }
};
</script>

<template lang="pug">
    div(v-if="initialized")
        error-boundary(:error="appError")
            link(type="text/css" rel="stylesheet" :href="stylesURL")

            template(v-if="isMultipleChats")
                template(v-if="!multiClient")
                    client-auth(@on-client-multiple-authorized='onMultiLogin' :greetings="greetings" :multiChatData="chats")

                multi-messenger#multi-messenger(
                    v-if="multiClient",
                    ref="multiMessenger",
                    @on-unread-changed='onUnreadChanged',
                    @on-message-received='onMessageReceived',
                    @on-file-clicked='onFileClicked',
                    @on-close='onClose',
                    @on-logout='onLogout',
                    @on-longtap="onLongTap",
                    @on-rating="onRating",
                    @on-messages-loaded="onMessagesLoaded",
                    :mode='mode',
                    :multiClient='multiClient',
                    :opened='opened',
                    :channel='channel',
                    :replayed-msg="replayedMsg",
                    :scrollToMsg="scrollToMsg",
                    :rating="rating",
                    :closeSystemChat="closeSystemChat",
                    :chats="chats",
                )
            template(v-else)
                template(v-if="!client")
                    client-create(v-if="!credentials && personalDataFormReady" @on-failed='onFailedLogin' @on-client-created='onLogin' @on-close-clicked='onClose' :greetings="greetings" :personalDataForm="personalDataForm" :channel="channel" :requireName="requireName")
                    client-auth(v-if="credentials" @on-client-authorized='onLogin' :credentials="credentials" :greetings="greetings" :channel="channel")
                messenger#messenger(v-if="client",
                    ref="messenger"
                    @on-unread-changed='onUnreadChanged'
                    @on-message-received='onMessageReceived'
                    @on-file-clicked='onFileClicked'
                    @on-close='onClose'
                    @on-logout='onLogout'
                    @on-longtap="onLongTap"
                    @on-rating="onRating"
                    @client-changed="onClientChanged"
                    @on-messages-loaded="onMessagesLoaded"
                    :mode='mode'
                    :client='client'
                    :opened='opened'
                    :channel='channel'
                    :replayed-msg="replayedMsg"
                    :scrollToMsg="scrollToMsg"
                    :rating="rating"
                    :closeSystemChat="closeSystemChat"
                    :app-error="appError",
                )
</template>
