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

  const frame = document.getElementById('iqchannels-app-iframe');
  if (!frame) {
    return;
  }

  const frameWindow = frame.contentWindow ? frame.contentWindow : frame.contentDocument.defaultView;
  if (!frameWindow) {
    return;
  }

  const msg = {
    Type: "write_to_client",
    WriteToClient: {
      Search: "Клиент"
    }
  };
  frameWindow.postMessage(msg, '*');
});
w.on('file-clicked', function (url) {
  console.log(url);
  window.alert(url);
});

window.widget = w;
