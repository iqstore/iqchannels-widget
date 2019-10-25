import "normalize.css";

/* globals IQChannelsWidget */
window.widget = new IQChannelsWidget({
  project: 'retail',
  channel: 'support',
  credentials: '2'
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
