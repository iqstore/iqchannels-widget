import { createApp } from 'vue';
// import Icon from 'vue-awesome/components/Icon.vue';
import 'vue-awesome/icons/close';
import 'vue-awesome/icons/paperclip';
import 'vue-awesome/icons/send';
import 'vue-awesome/icons/long-arrow-up';
import 'vue-awesome/icons/check';
import 'vue-awesome/icons/microphone';
import 'vue-awesome/icons/headphones';
import 'vue-awesome/icons/search';
import 'vue-awesome/icons/arrow-right';
import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue';
// import { humanDate, humanSize } from '../lib/filters';
import clientAuth from './client-auth.vue';
import clientCreate from './client-create.vue';
import messenger from './messenger/messenger.vue';
// import Vue2TouchEvents from 'vue2-touch-events';
// import { VueHammer } from 'vue2-hammer';
import App from './App.vue';

const app = createApp(App);

// VueHammer.config.pan = {
//   threshold: 25,
//   direction: 'right'
// };

// app.use(Vue2TouchEvents);
// app.use(VueHammer);

// app.filter('humanDate', humanDate);
// app.filter('humanSize', humanSize);

// app.component('icon', Icon);
app.component('App', App);
app.component('scale-loader', ScaleLoader);
app.component('client-auth', clientAuth);
app.component('client-create', clientCreate);
app.component('messenger', messenger);
// Vue.configureCompat({ WATCH_ARRAY: true });

app.mount('#app');
