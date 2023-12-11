import { createApp } from 'vue';
import Icon from 'vue-awesome/components/Icon';
import 'vue-awesome/icons/paperclip';
import 'vue-awesome/icons/long-arrow-alt-up';
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
import Vue3TouchEvents from 'vue3-touch-events';
import App from './App.vue';

const app = createApp(App);

// VueHammer.config.pan = {
//   threshold: 25,
//   direction: 'right'
// };

app.use(Vue3TouchEvents);

// app.filter('humanDate', humanDate);
// app.filter('humanSize', humanSize);

app.component('icon', Icon);
app.component('app', App);
app.component('scale-loader', ScaleLoader);
app.component('client-auth', clientAuth);
app.component('client-create', clientCreate);
app.component('messenger', messenger);

app.mount('#app');
