import "normalize.css";
import { LOCALSTORAGE_CHANNEL_NAME } from "../schema";

/* globals IQChannelsWidget */
window.widget = new IQChannelsWidget({
  channel: localStorage.getItem(LOCALSTORAGE_CHANNEL_NAME) || 'support',
  credentials: '3',
  iconOptions: {
    show: true,
    style: {
      backgroundColor: "#004885",
    }
  }
});
