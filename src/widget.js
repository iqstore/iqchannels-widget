import EventEmitter from 'event-emitter';
import './widget-normalize.scss';
import './widget.scss';

function getBaseUrl() {
	const scripts = document.getElementsByTagName('script');
	const path = scripts[scripts.length - 1].src.split('?')[0];
	const url = path.split('/').slice(0, -1).join('/') + '/';
	return url;
}

// From where widget.js is loaded
const BASE_URL = getBaseUrl();

const addPixels = (value, delta) => {
	const v = parseInt(value) + parseInt(delta);
	return `${v}px`;
};

const defaultIconOptions = {
	show: true
};

function objectAssign(dst, src) {
	if (dst === null) {
		throw new TypeError('Cannot convert undefined or null to object');
	}

	const to = Object(dst);
	for (let key in src) {
		// Avoid bugs when hasOwnProperty is shadowed
		if (Object.prototype.hasOwnProperty.call(src, key)) {
			to[key] = src[key];
		}
	}

	return to;
}

function cleanIconOptions(iconOptions) {
	let show = iconOptions?.show !== undefined ? iconOptions.show : defaultIconOptions.show;

	let style = {};
	if (iconOptions?.color !== undefined) {
		style.color = iconOptions.color;
	}
	if (iconOptions?.backgroundColor !== undefined) {
		style.backgroundColor = iconOptions.backgroundColor;
	}
	if (iconOptions?.style !== undefined) {
		style = objectAssign(style, iconOptions.style);
	}

	return {
		show: show,
		style: style
	};
}

class IQChannelsWidget extends EventEmitter {
	constructor(
		{
			url = null,
			channel = 'support',
			credentials,
			mode = 'web',
			project,
			width = 425,
			padBody = true,
			requireName = true,
			iconOptions = {},
			DOMIdentifier,
			chats = [],
			enableImgModals = true
		}
	) {
		super();
		url = url ? url : BASE_URL;

		this.mode = mode === 'mobile' ? mode : 'web';
		this.width = this.mode === 'mobile' ? window.innerWidth : width;
		this.channel = channel;
		this.credentials = credentials || '';
		this.project = project || '';
		this.padBody = padBody;
		this.requireName = requireName;
		this.pushToken = null;
		this.opened = false;
		this.DOMIdentifier = DOMIdentifier || null;
		this.enableImgModals = enableImgModals;
		this.chats = chats;
		this.isMultipleChats = this.chats.length > 0;

		// split
		this.frameContainer = document.createElement('div');
		this.frameContainer.id = 'iqchannels-widget-container';

		const widgetDiv = document.createElement('div');
		widgetDiv.id = 'iqchannels-widget';
		widgetDiv.style.width = `${this.width}px`;
		// widgetDiv.style.height = `${window.innerHeight}px`;

		const iframe = document.createElement('iframe');
		iframe.id = 'iqchannels-widget-iframe';
		this.checkUrlAvailability(url).then((available) => {
			if (available) {
				this.available = true;
				iframe.src = url;
				widgetDiv.appendChild(iframe);
				this.checkPageIsReady();
			}
		}).catch((error) => {
			this.available = false;
			this.checkPageIsReady();
			this.handleError();
			this.emit('error', error);
		});
		iframe.allow = "clipboard-read; clipboard-write";

		this.frameContainer.appendChild(widgetDiv);

        this.initIcon();
	}

	initIcon = () => {
		this.icon = document.createElement('a');
		this.icon.href = '#';
		this.icon.id = 'iqchannels-widget-icon';

		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('version', '1.1');
		svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
		svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
		svg.setAttribute('x', '0px');
		svg.setAttribute('y', '0px');
		svg.setAttribute('viewBox', '0 0 1000 1000');
		svg.setAttribute('enable-background', 'new 0 0 1000 1000');
		svg.setAttribute('xml:space', 'preserve');
		const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path.setAttribute('d', 'M500,867.5c-31.3,0-61.9-2.8-91.6-7.8L193.8,990V773.1C81.8,694.6,10,574.1,10,438.7C10,202,229.4,10,500,10c270.6,0,490,192,490,428.7C990,675.5,770.6,867.5,500,867.5z M500,71.2c-236.8,0-428.8,164.5-428.8,367.5c0,124.5,72.4,234.4,183,300.9l-1.9,142.1L396.5,795c33.2,7.1,67.8,11.2,103.5,11.2c236.8,0,428.8-164.5,428.8-367.5C928.8,235.8,736.8,71.2,500,71.2z M745,500c-33.8,0-61.3-27.4-61.3-61.3c0-33.8,27.4-61.2,61.3-61.2c33.8,0,61.3,27.4,61.3,61.2C806.3,472.6,778.8,500,745,500z M500,500c-33.8,0-61.3-27.4-61.3-61.3c0-33.8,27.4-61.2,61.3-61.2s61.3,27.4,61.3,61.2C561.3,472.6,533.8,500,500,500z M255,500c-33.8,0-61.3-27.4-61.3-61.3c0-33.8,27.4-61.2,61.3-61.2c33.8,0,61.3,27.4,61.3,61.2C316.3,472.6,288.8,500,255,500z');
		g.appendChild(path);
		svg.appendChild(g);

		this.icon.appendChild(svg);

        this.icon.style.display = 'none';
	}

    displayIcon = () => {
        let iconOptions = cleanIconOptions(this.iconOptions);
        
        this.icon.style.display = iconOptions.show ? 'block' : 'none';
		for (const property in iconOptions.style) {
			if (iconOptions.style.hasOwnProperty(property)) {
				this.icon.style[property] = iconOptions.style[property];
			}
		}
    }

	checkPageIsReady = () => {
		switch (document.readyState) {
			case "loading":
			case "interactive":
				setTimeout(() => {
					this.checkPageIsReady();
				}, 100);
				break;
			case "complete":
				this.available ? this.onDOMloaded() : this.appendWidgetsContainer();
				break;
		}
	}

	appendWidgetsContainer = () => {
		document.body.appendChild(this.icon);

		const widgetContainer = document.getElementById(this.DOMIdentifier);
		const containerToAppend = widgetContainer || document.body;
		containerToAppend.appendChild(this.frameContainer);

		this.icon.addEventListener('click', (e) => {
			e.preventDefault();
			this.toggle();
		});
	}

	onDOMloaded = () => {
		this.appendWidgetsContainer();

		// Setup handlers
		window.addEventListener('message', this.onFrameMessage);

		// Find and store frame window to post messages
		const frame = document.getElementById('iqchannels-widget-iframe');
		this.frameWindow = frame.contentWindow || frame.contentDocument.defaultView;

		frame.addEventListener('load', () => {
			const event = newChatEvent('init', {
				channel: this.channel,
				credentials: this.credentials,
				mode: this.mode,
				project: this.project,
				requireName: this.requireName,
				pushToken: this.pushToken,
				enableImgModals: this.enableImgModals,
				chats: this.chats,
				isMultipleChats: this.isMultipleChats,
			});
			this.frameWindow.postMessage(JSON.stringify(event), '*');
		});
	}

	handleError = () => {
		const widget = document.getElementById('iqchannels-widget');
		const errorMessage = document.createElement('div');
		errorMessage.classList.add('iqchannels-error-message');

		const errorIco = document.createElement('span');
		errorIco.textContent = '😢';
		errorIco.classList.add('iqchannels-error-message_ico');
		const errorTitle = document.createElement('span');
		errorTitle.classList.add('iqchannels-error-message_title');
		errorTitle.textContent = 'Чат временно не доступен';
		const errorText = document.createElement('span');
		errorText.classList.add('iqchannels-error-message_text');
		errorText.textContent = 'Мы уже все исправляем. Обновите страницу или попробуйте позже.';

		errorMessage.appendChild(errorIco);
		errorMessage.appendChild(errorTitle);
		errorMessage.appendChild(errorText);

		widget.appendChild(errorMessage);
	};

	open = (text) => {
		if (this.opened) {
			return;
		}

		this.opened = true;
		if (this.padBody) {
			const body = document.body;
			const currentPaddingRight = window.getComputedStyle(body).paddingRight;
			body.style.paddingRight = addPixels(currentPaddingRight, this.width);
		}

		const currentRight = window.getComputedStyle(this.icon).right;
		this.icon.style.right = addPixels(currentRight, this.width);

		const event = newChatEvent('open');
		this.frameWindow?.postMessage(JSON.stringify(event), '*');
		this.frameContainer.style.display = 'block';
		setTimeout(() => this.frameWindow?.focus(), 200);
		this.emit('open');

		if (text) {
			this.appendText(text);
		}
	};

	checkUrlAvailability = async (url) => (await fetch(url)).ok;

	appendText = (text) => {
		const event = newChatEvent('append_text', { text: text });
		this.frameWindow.postMessage(JSON.stringify(event), '*');
	};

	close = () => {
		if (!this.opened) {
			return;
		}

		this.opened = false;
		const event = newChatEvent('close');
		this.frameWindow?.postMessage(JSON.stringify(event), '*');
		this.frameContainer.style.display = 'none';

		if (this.padBody) {
			const body = document.body;
			const currentPaddingRight = window.getComputedStyle(body).paddingRight;
			body.style.paddingRight = addPixels(currentPaddingRight, -this.width);
		}
		const currentRight = window.getComputedStyle(this.icon).right;
		this.icon.style.right = addPixels(currentRight, -this.width);
		this.emit('close');
	};

	destroy = () => {
		this.close();

		if (this.frameContainer && this.frameContainer.parentNode) {
			this.frameContainer.parentNode.removeChild(this.frameContainer);
		}
		if (this.icon && this.icon.parentNode) {
			this.icon.parentNode.removeChild(this.icon);
		}
	};

	onFrameMessage = (e) => {
		if (e.type !== 'message') {
			return;
		}
		const { type, data } = e.data;
		switch (type) {
			case 'iqchannels-widget-close':
				this.close();
				break;

			case 'iqchannels-widget-message':
				this.emit('message');
				break;

			case 'iqchannels-widget-file':
				this.emit('file-clicked', data);
				break;

			case 'iqchannels-widget-unread':
				this.emit('unread', data);
				break;

			case 'iqchannels-widget-longtap':
				this.emit('longtap', JSON.parse(data));
				break;

			case 'iqchannels-widget-rating':
				this.emit('rating', data);
				break;

			case 'iqchannels-error':
				if (!JSON.parse(data)) {
					break;
				}
				this.emit('error', JSON.parse(data));
				break;

			case 'iqchannels-ready':
		        this.displayIcon();
				this.emit('ready');
				break;

			default:
				break;
		}
	};

	toggle = () => {
		this.opened ? this.close() : this.open();
	};

	logout = () => {
		const event = newChatEvent('logout');
		this.frameWindow.postMessage(JSON.stringify(event), '*');
	};

	refreshClient = () => {
		const event = newChatEvent('refresh_client');
		this.frameWindow.postMessage(JSON.stringify(event), '*');
	};

	setIPhonePushToken = (token) => {
		const data = { type: 'apns', token: token };
		const event = newChatEvent('push_token', data);

		if (this.frameWindow) {
			this.frameWindow.postMessage(JSON.stringify(event), '*');
		} else {
			this.pushToken = data;
		}
	};

	setAndroidPushToken = (token) => {
		const data = { type: 'fcm', token: token };
		const event = newChatEvent('push_token', data);

		if (this.frameWindow) {
			this.frameWindow.postMessage(JSON.stringify(event), '*');
		} else {
			this.pushToken = data;
		}
	};

	replyMessage = (msg) => {
		const event = newChatEvent('reply-message', msg);
		this.frameWindow.postMessage(JSON.stringify(event), '*');
	};

	scrollToMessage = (msg) => {
		const event = newChatEvent('scroll-to-message', msg);
		this.frameWindow.postMessage(JSON.stringify(event), '*');
	};

	sendRatingData = (rating) => {
		const event = newChatEvent('get-rating', rating);
		this.frameWindow.postMessage(JSON.stringify(event), '*');
	}
}

function newChatEvent(type, data) {
	return {
		type: type,
		data: data
	};
}

window.IQChannelsWidget = IQChannelsWidget;
