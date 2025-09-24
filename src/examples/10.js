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
const mockEventData = {
  type: "UPDATE_TICKET_CATEGORY",
  payload: {
    TicketID: 170477,
    Category: {
      ExternalCategoryID: "CAT_001",
      CategoryTitle: "Техподдержка",
      Parent: {
        ExternalCategoryID: "CAT_PARENT_01",
        CategoryTitle: "Поддержка",
        Parent: {
          ExternalCategoryID: "CAT_ROOT",
          CategoryTitle: "Услуги"
        }
      }
    }
  }
}

const elem = document.getElementById("event-message");
elem.value = JSON.stringify(mockEventData, null, 2);
elem.style.height = '';
elem.style.height = elem.scrollHeight + 'px';

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
  frameWindow?.postMessage(msg, '*');
});
w.on('file-clicked', function (url) {
  window.alert(url);
});

window.widget = w;
