import 'normalize.css';
import { LOCALSTORAGE_CHANNEL_NAME } from "../schema";
import { togglePrefillMessageBlock } from "./examples-utils";

window.togglePrefillMessageBlock = togglePrefillMessageBlock

/* globals IQChannelsWidget */
window.widget = new IQChannelsWidget({
  channel: localStorage.getItem(LOCALSTORAGE_CHANNEL_NAME) || 'support',
  credentials: '4',
  width: 425,
  iconOptions: { show: true }
});

widget.on("unread", (count) => {
  document.getElementById("unread_count").textContent = count;
})
