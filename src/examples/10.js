import "normalize.css";
import { LOCALSTORAGE_CHANNEL_NAME } from "../schema";

/* globals IQChannelsWidget */
var w = new IQChannelsWidget({
  channel: localStorage.getItem(LOCALSTORAGE_CHANNEL_NAME) || 'support',
  credentials: '10',
  mode: 'mobile',
  width: 425,
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
  window.alert(url);
});

window.widget = w;
