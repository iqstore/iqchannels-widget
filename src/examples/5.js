import 'normalize.css';
import { LOCALSTORAGE_CHANNEL_NAME } from "../schema";
/* globals IQChannelsWidget */
window.widget = new IQChannelsWidget({
  channel: localStorage.getItem(LOCALSTORAGE_CHANNEL_NAME) || 'support',
  credentials: '5',
  width: 280,
    padBody: false,
    iconOptions: {
      show: false,
    },
    DOMIdentifier: 'ion-nav',
    mode: 'mobile',
    imgModalOptions: {
      enabled: true,
      state: 'mobile'
    },
    onLinkClick: (type, value) => {

        if (!value) {
            return;
          }
          switch (type) {
            case 'URL':
              window.open(value, '_system');
              break;
            case 'EMAIL':
              window.location.href = 'email';
              break;
            case 'PHONE':
              window.location.href = 'phone';
              break;
          }
    }
});

