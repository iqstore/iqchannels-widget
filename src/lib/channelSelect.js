import { LOCALSTORAGE_CHANNEL_NAME } from "../schema";

export function selectChannel() {
    const channelName = localStorage.getItem(LOCALSTORAGE_CHANNEL_NAME);

    if (!channelName) {
        let channelTyped;
        while (!channelTyped) {
            channelTyped = prompt("Введите название канала Внутреннего чата (на английском), используемого для тестовых клиентов");
        }
        localStorage.setItem(LOCALSTORAGE_CHANNEL_NAME, channelTyped);
    } else {
        alert(`Канал уже выбран. Текущий канал: ${channelName}`);
    }
}

export function clearChannel() {
    localStorage.removeItem(LOCALSTORAGE_CHANNEL_NAME);
}
