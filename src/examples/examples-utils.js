import { DefaultThirdClientConfig, LOCALSTORAGE_CHANNEL_NAME, LOCALSTORAGE_WIDGET_CONFIG } from "../schema";

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

export function configureWidget(key, defaultConfig) {
    const configTyped = prompt("Введите конфиг для данного клиента:",
        JSON.stringify( JSON.parse(localStorage.getItem(key)) ?? defaultConfig, null, 2)
    );
    if (configTyped) {
        window.widget.logout();
        localStorage.setItem(key, configTyped);
        const current = window.document.getElementById("iqchannels-widget-container");
        const ico = window.document.getElementById("iqchannels-widget-icon");
        current.remove();
        ico.remove();
        window.widget = new IQChannelsWidget(JSON.parse(configTyped));
        const element = window.document.getElementById("current_config");
        element.innerHTML = configTyped ? `${JSON.stringify(JSON.parse(configTyped), null, 2)}` : `Нету конфигурации.`;
    }
}

export function togglePrefillMessageBlock() {
    document.getElementById('file_input').addEventListener('change', function(event) {
        var files = event.target.files;
        var fileNames = document.getElementById( 'file_names' );
        var fullName = "";

        if (event.target.files.length > 0) {
            for (var i = 0; i < files.length; i++) { 
                fullName += files[i].name + ", "
            }
        }
        fileNames.textContent = fullName
    });

    const block = document.getElementById("prefill_message_block");
    if (!block) return;
    block.style.display = block.style.display === "none" ? "block" : "none";
}

