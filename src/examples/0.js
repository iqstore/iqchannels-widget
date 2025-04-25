import "normalize.css";
import { DefaultAnonClientConfig, LOCALSTORAGE_WIDGET_0_CONFIG } from "../schema";
import { configureWidget } from "./examples-utils";

window.configureWidget = configureWidget.bind(null, DefaultAnonClientConfig);
window.onload = () => {
	let config = JSON.parse(DefaultAnonClientConfig);
	const current = window.document.getElementById("current_config");
	current.innerHTML = config ? `${JSON.stringify(config, null, 2)}` : `Нету конфигурации.`;
};
/* globals IQChannelsWidget */
window.widget = new IQChannelsWidget(

    DefaultAnonClientConfig);
