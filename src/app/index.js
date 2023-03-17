/* globals parent */

import jquery from 'jquery';
import Vue from 'vue';
import Icon from 'vue-awesome/components/Icon.vue';
import 'vue-awesome/icons/close';
import 'vue-awesome/icons/paperclip';
import 'vue-awesome/icons/send';
import 'vue-awesome/icons/long-arrow-up';
import 'vue-awesome/icons/check';
import 'vue-awesome/icons/microphone';
import 'vue-awesome/icons/headphones';
import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue';
import client from '../client';
import config from '../config';
import { humanDate, humanSize } from '../lib/filters';
import { clearCookie } from '../lib/web';
import clientAuth from './client-auth.vue';
import clientCreate from './client-create.vue';
import messenger from './messenger/messenger.vue';
import Vue2TouchEvents from 'vue2-touch-events';
import { VueHammer } from 'vue2-hammer';

VueHammer.config.pan = {
  threshold: 25,
  direction: 'right'
};

Vue.use(Vue2TouchEvents);
Vue.use(VueHammer);

Vue.filter('humanDate', humanDate);
Vue.filter('humanSize', humanSize);

Vue.component('icon', Icon);
Vue.component('scale-loader', ScaleLoader);
Vue.component('client-auth', clientAuth);
Vue.component('client-create', clientCreate);
Vue.component('messenger', messenger);

const app = new Vue({
  el: '#app',
  template: `
        <div v-if="initialized">
          <link type="text/css" rel="stylesheet" :href="stylesURL" />
          
          <client-create v-if="!client && !credentials" @on-client-created='onLogin' @on-close-clicked='onClose' :greetings="greetings" :channel="channel" :requireName="requireName"/>
          <client-auth v-if="!client && credentials" @on-client-authorized='onLogin' :credentials="credentials" :greetings="greetings" :channel="channel"/>
          <messenger v-if="client" ref="messenger"
              @on-unread-changed='onUnreadChanged'
              @on-message-received='onMessageReceived'
              @on-file-clicked='onFileClicked'
              @on-close='onClose'
              @on-logout='onLogout'
              @on-longtap="onLongTap"
              @on-rating="onRating"
              :mode='mode'
              :client='client'
              :opened='opened'
              :channel='channel'
              :replayed-msg="replayedMsg"
              :scrollToMsg="scrollToMsg"       
              :rating="rating"
              :closeSystemChat="closeSystemChat"       
          />
        </div>`,

  computed: {
    'stylesURL': function () {
      return config.apiUrl('/widget/styles.css?channel=' + this.channel);
    }
  },

  data: () => {
    return {
      initialized: false,
      mode: 'web', // web'\'mobile'
      opened: false,
      closeSystemChat: false,
      channel: null,
      credentials: null,
      greetings: null,
      project: null,
      requireName: true,
      client: null,
      pushToken: null,
      replayedMsg: null,
      scrollToMsg: null,
      rating: null
    };
  },

  created () {
    jquery(window).on('message', (e) => {
      const { type, data } = e.originalEvent;

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
          this.requireName = event.data.requireName;
          this.pushToken = event.data.pushToken;

          this.maybeSendPushToken();
          this.getGreetings();
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

          this.$refs.messenger.appendText(text);
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
    onClose: () => parent.postMessage({ type: 'iqchannels-widget-close' }, '*'),
    onMessageReceived: () => parent.postMessage({ type: 'iqchannels-widget-message' }, '*'),
    onFileClicked: (url) => parent.postMessage({ type: 'iqchannels-widget-file', data: url }, '*'),
    onUnreadChanged: (count) => parent.postMessage({ type: 'iqchannels-widget-unread', data: count }, '*'),
    onLongTap: (msg) => parent.postMessage({ type: 'iqchannels-widget-longtap', data: msg }, '*'),
    onRating: (rating) => parent.postMessage({ type: 'iqchannels-widget-rating', data: rating }, '*'),

    onLogin (client) {
      this.client = client;
      this.maybeSendPushToken();
    },

    onLogout () {
      clearCookie(config.CLIENT_SESSION_COOKIE);
      this.credentials = null;
      this.project = null;
      this.client = null;

      client.clearAuth();
    },

    maybeSendPushToken () {
      if (!this.client) {
        return;
      }
      if (!this.pushToken) {
        return;
      }

      const tdata = this.pushToken;
      client.channelPushToken(this.channel, tdata.type, tdata.token);
    },

    refreshClient () {
      if (!this.client) {
        return;
      }
      if (!this.credentials) {
        return;
      }

      client.refreshClient(this.credentials);
    },
    getGreetings () {
      client.getWidgetGreetings(this.channel).then(res => {
        this.greetings = res.Data;
      });
    }
  }
});

export default app;
