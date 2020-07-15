import "normalize.css";

/* globals IQChannelsWidget */
var w = new IQChannelsWidget({
  channel: 'support',
  credentials: '10',
  mode: 'mobile',
  width: 280,
  iconOptions: { show: true }
});
w.on('open', function () {
  console.log('WIDGET OPENED');
});
w.on('file-clicked', function (url) {
  console.log(url);
  window.alert(url);
});

window.widget = w;
