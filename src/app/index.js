import { createApp } from 'vue';
import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue';
import clientAuth from './client-auth.vue';
import clientCreate from './client-create.vue';
import messenger from './messenger/messenger.vue';
import multiMessenger from "./multi-messenger/multi-messenger.vue";
import Vue3TouchEvents from 'vue3-touch-events';
import App from './App.vue';
import { VueHammer } from '../lib/vue3-hammer';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faArrowLeft,
    faArrowRight, faEllipsisVertical,
    faFile,
    faFileExcel,
    faFilePdf,
    faFileWord, faMessage,
    faSearch,
    faTimes, faUser
} from '@fortawesome/free-solid-svg-icons';
import VWave from "v-wave";
import VueSimpleContextMenu from 'vue-simple-context-menu';
import 'vue-simple-context-menu/dist/vue-simple-context-menu.css';

library.add(
    faFile,
    faFileWord,
    faFilePdf,
    faFileExcel,
    faArrowLeft,
    faTimes,
    faSearch,
    faArrowRight,
    faMessage,
    faEllipsisVertical,
    faUser,
);

const app = createApp(App);

app.use(VueHammer, {
    threshold: 25,
    direction: 'right'
});

app.use(Vue3TouchEvents);
app.use(VWave, {
    initialOpacity: 0.25,
    duration: 0.15,
    easing: 'ease-in'
});

app.component('app', App);
app.component('scale-loader', ScaleLoader);
app.component('client-auth', clientAuth);
app.component('client-create', clientCreate);
app.component('multi-messenger', multiMessenger);
app.component('messenger', messenger);
app.component('font-awesome-icon', FontAwesomeIcon);
app.component('v-context', VueSimpleContextMenu);

app.mount('#app');
