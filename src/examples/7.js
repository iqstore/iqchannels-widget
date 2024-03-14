import "normalize.css";
import { LOCALSTORAGE_CHANNEL_NAME } from "../schema";

/* globals IQChannelsWidget */
window.widget = new IQChannelsWidget({
  channel: localStorage.getItem(LOCALSTORAGE_CHANNEL_NAME) || 'support',
  credentials: '7',
  width: 425,
  iconOptions: { show: true }
});
