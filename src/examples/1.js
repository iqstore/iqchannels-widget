import "normalize.css";
import { LOCALSTORAGE_CHANNEL_NAME } from "../schema";

/* globals IQChannelsWidget */
var w = new IQChannelsWidget({
  channel: localStorage.getItem(LOCALSTORAGE_CHANNEL_NAME) || 'support',
  credentials: '101',
  padBody: false,
  width: 425,
  iconOptions: {
    show: true,
    style: {
      backgroundColor: "#004885",
    }
  }
});

window.widget = w;
w.on('unread', function (count) {
  console.log('WIDGET UNREAD COUNT', count);
});
w.on('message', function () {
  console.log('WIDGET ON MESSAGE');
});
w.on('close', function () {
  console.log('WIDGET CLOSED');
});
w.on('open', function () {
  console.log('WIDGET OPENED');
});
widget.on('error', function (error) {
  console.log('WIDGET ERROR: \n' + JSON.stringify(error));
});
widget.on('ready', function () {
  console.log('WIDGET IS READY');
});

w.setIPhonePushToken('test-iphone-push-token0');
