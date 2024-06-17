import 'normalize.css';
import { LOCALSTORAGE_CHANNEL_NAME } from "../schema";

/* globals IQChannelsWidget */
window.widget = new IQChannelsWidget({
  project: 'retail',
  channel: localStorage.getItem(LOCALSTORAGE_CHANNEL_NAME) || 'support',
  width: 425,
  credentials: '2',
  iconOptions: {
    show: true,
    style: {
      backgroundColor: "#004885",
    }
  }
});
widget.on('unread', function (count) {
  console.log('WIDGET UNREAD COUNT', count);
});
widget.on('message', function () {
  console.log('WIDGET ON MESSAGE');
});
widget.on('close', function () {
  console.log('WIDGET CLOSED');
});
widget.on('open', function () {
  console.log('WIDGET OPENED');
});
widget.on('error', function (error) {
  console.log('WIDGET ERROR: \n' + JSON.stringify(error));
});
widget.on('ready', function () {
  console.log('WIDGET IS READY');
});

widget.setAndroidPushToken('test-android-push-token0');
