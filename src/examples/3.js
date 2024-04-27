import "normalize.css";
import { DefaultThirdClientConfig, LOCALSTORAGE_WIDGET_CONFIG } from "../schema";
import { configureWidget } from "./examples-utils";

window.configureWidget = configureWidget;
window.onload = () => {
    const cookies = document.cookie;
    let config = window.localStorage.getItem(LOCALSTORAGE_WIDGET_CONFIG) ?? DefaultThirdClientConfig;
    config = JSON.parse(config);
    const current = window.document.getElementById("current_config");
    current.innerHTML = config ? `${JSON.stringify(config, null, 2)}` : `Нету конфигурации.`;
};
/* globals IQChannelsWidget */
window.widget = new IQChannelsWidget(JSON.parse(localStorage.getItem(LOCALSTORAGE_WIDGET_CONFIG)) ?? DefaultThirdClientConfig);
