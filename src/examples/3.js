import "normalize.css";
import { DefaultThirdClientConfig, LOCALSTORAGE_WIDGET_CONFIG } from "../schema";
import { configureWidget } from "./examples-utils";

window.configureWidget = configureWidget.bind(null, LOCALSTORAGE_WIDGET_CONFIG, DefaultThirdClientConfig);
window.onload = () => {
	let config = JSON.parse(window.localStorage.getItem(LOCALSTORAGE_WIDGET_CONFIG)) ?? DefaultThirdClientConfig;
	const current = window.document.getElementById("current_config");
	current.innerHTML = config ? `${JSON.stringify(config, null, 2)}` : `Нету конфигурации.`;
};
/* globals IQChannelsWidget */
window.widget = new IQChannelsWidget(JSON.parse(localStorage.getItem(LOCALSTORAGE_WIDGET_CONFIG)) ?? DefaultThirdClientConfig);
