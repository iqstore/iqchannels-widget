/* globals parent */

import jquery from 'jquery';
import Vue from 'vue';
import Icon from 'vue-awesome/components/Icon.vue';
import 'vue-awesome/icons/close';
import 'vue-awesome/icons/paperclip';
import 'vue-awesome/icons/send';
import linkify from 'vue-linkify';
import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue';
import config from '../config';
import { humanDate, humanSize } from '../lib/filters';
import { clearCookie } from '../lib/web';
import clientAuth from './client-auth.vue';
import clientCreate from './client-create.vue';
import messenger from './messenger/messenger.vue';

Vue.filter('humanDate', humanDate);
Vue.filter('humanSize', humanSize);

Vue.component('icon', Icon);
Vue.component('scale-loader', ScaleLoader);
Vue.component('client-auth', clientAuth);
Vue.component('client-create', clientCreate);
Vue.component('messenger', messenger);

Vue.directive('linkified', linkify);

const app = new Vue({
  el: '#app',
  template: `
        <div v-if="initialized">
          <client-create v-if="!client && !credentials" @on-client-created='onLogin' :channel="channel" :requireName="requireName"/>
          <client-auth v-if="!client && credentials" @on-client-authorized='onLogin' :credentials="credentials" :channel="channel"/>
          <messenger v-if="client" ref="messenger"
              @on-unread-changed='onUnreadChanged'
              @on-message-received='onMessageReceived'
              @on-close='onClose'
              @on-logout='onLogout'
              :client='client'
              :opened='opened'
              :channel='channel'
          />
        </div>`,

  data: () => {
    return {
      initialized: false,
      opened: false,
      channel: null,
      credentials: null,
      project: null,
      requireName: true,
      client: null
    };
  },

  created() {
    jquery(window).on('message', (e) => {
      const { type, data } = e.originalEvent;

      if (type !== 'message') {
        return;
      }

      const event = JSON.parse(data);

      switch (event.type) {
        case 'init':
          this.initialized = true;
          this.channel = event.data.channel;
          this.credentials = event.data.credentials;
          this.project = event.data.project;
          this.requireName = event.data.requireName;
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
      }
    });
  },

  methods: {
    onClose: () => parent.postMessage({ type: 'iqchannels-widget-close' }, '*'),
    onMessageReceived: () => parent.postMessage({ type: 'iqchannels-widget-message' }, '*'),
    onUnreadChanged: (count) => parent.postMessage({ type: 'iqchannels-widget-unread', data: count }, '*'),

    onLogin(client) {
      this.client = client;
    },

    onLogout() {
      clearCookie(config.CLIENT_SESSION_COOKIE);
      this.credentials = null;
      this.project = null;
      this.client = null;
    }
  }
});

export default app;
