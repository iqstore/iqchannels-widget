import "normalize.css";
import { selectChannel, clearChannel } from "../lib/channelSelect";
import { LOCALSTORAGE_CHANNEL_NAME } from "../schema";

window.selectChannel = selectChannel;
window.clearChannel = clearChannel;
window.onload = () => {
    const channelName = window.localStorage.getItem(LOCALSTORAGE_CHANNEL_NAME);
    const current = window.document.getElementById("current_channel");
    current.innerHTML =  channelName ? `Текущий канал: ${channelName}` : `Текущий канал не выбран.`;
};
