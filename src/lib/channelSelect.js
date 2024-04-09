import { LOCALSTORAGE_CHANNEL_NAME } from "../schema";

export function selectChannel() {
    const current = document.getElementById("current_channel");

    const channelTyped = prompt("Введите название канала Внутреннего чата (на английском), используемого для тестовых клиентов", "support");
    if (channelTyped) {
        localStorage.setItem(LOCALSTORAGE_CHANNEL_NAME, channelTyped);
        current.innerHTML = `Текущий канал: ${channelTyped}`;
    }
}

export function clearChannel() {
    const current = document.getElementById("current_channel");
    const yesOrNo = confirm("Подтвердите сброс канала для localStorage");
    if (yesOrNo) {
        localStorage.removeItem(LOCALSTORAGE_CHANNEL_NAME);
        current.innerHTML = `Текущий канал не выбран.`;
    }
}
