/* globals IQChannelsWidget */
var w = new IQChannelsWidget({
  channel: 'support',
  credentials: '2',
  width: 280,
  iconOptions: { show: true }
});
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
