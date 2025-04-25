import "normalize.css";
import { DefaultAnonClientConfig, LOCALSTORAGE_WIDGET_0_CONFIG } from "../schema";
import { configureWidget } from "./examples-utils";

window.configureWidget = configureWidget.bind(null, DefaultAnonClientConfig);
window.onload = () => {
	const current = window.document.getElementById("current_config");
	current.innerHTML =  `${JSON.stringify(DefaultAnonClientConfig, null, 2)}` 
};
/* globals IQChannelsWidget */
window.widget = new IQChannelsWidget(DefaultAnonClientConfig);
