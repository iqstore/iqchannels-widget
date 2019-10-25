import "normalize.css";

/* globals IQChannelsWidget */
var w = new IQChannelsWidget({
  channel: 'support',
  credentials: '101',
  padBody: false,
  iconOptions: {
    show: true,
    style: {
      backgroundColor: "#faef13",
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
