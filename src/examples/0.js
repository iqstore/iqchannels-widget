import "normalize.css";
import { DefaultAnonClientConfig, LOCALSTORAGE_WIDGET_0_CONFIG } from "../schema";
import { configureWidget } from "./examples-utils";

window.configureWidget = configureWidget.bind(LOCALSTORAGE_WIDGET_0_CONFIG, DefaultAnonClientConfig);
window.onload = () => {
	let config = JSON.parse(window.localStorage.getItem(LOCALSTORAGE_WIDGET_0_CONFIG)) ?? DefaultAnonClientConfig;
	const current = window.document.getElementById("current_config");
	current.innerHTML = config ? `${JSON.stringify(config, null, 2)}` : `Нету конфигурации.`;
};
/* globals IQChannelsWidget */
window.widget = new IQChannelsWidget(JSON.parse(localStorage.getItem(LOCALSTORAGE_WIDGET_0_CONFIG)) ?? DefaultAnonClientConfig);
