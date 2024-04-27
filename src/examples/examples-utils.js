import { DefaultThirdClientConfig, LOCALSTORAGE_CHANNEL_NAME, LOCALSTORAGE_WIDGET_CONFIG } from "../schema";

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

export function configureWidget() {
    const configTyped = prompt("Введите конфиг для данного клиента:",
        JSON.stringify( JSON.parse(localStorage.getItem(LOCALSTORAGE_WIDGET_CONFIG)) ?? DefaultThirdClientConfig, null, 2)
    );
    if (configTyped) {
        window.widget.logout();
        localStorage.setItem(LOCALSTORAGE_WIDGET_CONFIG, configTyped);
        const current = window.document.getElementById("iqchannels-widget-container");
        const ico = window.document.getElementById("iqchannels-widget-icon");
        current.remove();
        ico.remove();
        window.widget = new IQChannelsWidget(JSON.parse(configTyped));
        const element = window.document.getElementById("current_config");
        element.innerHTML = configTyped ? `${JSON.stringify(JSON.parse(configTyped), null, 2)}` : `Нету конфигурации.`;
    }
}
