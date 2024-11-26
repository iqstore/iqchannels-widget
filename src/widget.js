import EventEmitter from 'event-emitter';
import './widget-normalize.scss';
import './widget.scss';
import { humanDateTime } from "./lib/filters";

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

function clickDownload(url) {
	const a = document.createElement("a");
	a.style.display = "none";
	a.href = url;
	a.target = "blank";
	a.download = "iQChannels_file";
	document.body.appendChild(a);
	a.click();
	a.remove();
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
            metadata = null,
			imgModalOptions = {
				enabled: true,
				state: 'web'
			},
		}
	) {
		super();
		url = url ? url : BASE_URL;

		this.mode = mode === 'mobile' ? mode : 'web';
		this.width = this.mode === 'mobile' ? window.innerWidth : width;
		if (this.imgModalOptions) {
			this.imgModalOptions.state = this.mode
		}
		this.channel = channel;
		this.credentials = credentials || '';
		this.project = project || '';
		this.padBody = padBody;
		this.requireName = requireName;

        this.prepareMetadata(metadata);

        this.iconOptions = cleanIconOptions(iconOptions);

		this.pushToken = null;
		this.opened = false;
		this.DOMIdentifier = DOMIdentifier || null;
		this.imgModalOptions = imgModalOptions;
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

    prepareMetadata = (metadata) => {
        this.metadata = JSON.parse(metadata || '{}');
        if (this.metadata.version) {
            this.metadata.Version = this.metadata.version;
        }
        if (this.metadata.manufacturer) {
            this.metadata.Manufacturer = this.metadata.manufacturer;
        }
        if (this.metadata.model) {
            this.metadata.Model = this.metadata.model;
        }
        delete this.metadata.version;
        delete this.metadata.manufacturer;
        delete this.metadata.model;

        this.metadata.Fields = {
            ...this.metadata,
        }
        delete this.metadata.Fields.Version;
        delete this.metadata.Fields.OS;
        delete this.metadata.Fields.Model;
        delete this.metadata.Fields.Manufacturer;

        if (!Object.keys(this.metadata.Fields).length) {
            delete this.metadata.Fields;
        }

        if (!Object.keys(this.metadata).length) {
            this.metadata = null;
        }
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
                metadata: this.metadata,
				pushToken: this.pushToken,
				imgModalOptions: this.imgModalOptions,
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

			case 'iqchannels-image':
				if (!JSON.parse(data)) {
					break;
				}
				this.showImgModal(JSON.parse(data));
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

	showImgModal = (modalImageMsg) => {
		const modal = document.createElement('div');
		modal.className = 'iqchannels-modal';
		const header = document.createElement('div');
		header.className = 'iqchannels-modal_img_header';
		const closeIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		closeIcon.setAttribute('height', '1em');
		closeIcon.setAttribute('viewBox', '0 0 448 512');
		closeIcon.innerHTML = '<path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>';
		closeIcon.addEventListener('click', () => {
			document.body.removeChild(modal);
		});

		const closeIconContainer = document.createElement('div');
		closeIconContainer.className = 'iqchannels-modal_img_header-icon';
		closeIconContainer.appendChild(closeIcon);
		header.appendChild(closeIconContainer);

		const titleContainer = document.createElement('div');
		titleContainer.className = 'iqchannels-modal_img_header-title';

		const authorSpan = document.createElement('span');
		authorSpan.textContent = modalImageMsg.Author === 'user'
			? modalImageMsg.User.DisplayName
			: modalImageMsg.Client.Name;

		const dateSpan = document.createElement('span');
		dateSpan.className = 'iqchannels-modal_img_header-title_date';
		dateSpan.textContent = humanDateTime(new Date(modalImageMsg.CreatedAt));

		titleContainer.appendChild(authorSpan);
		titleContainer.appendChild(dateSpan);
		header.appendChild(titleContainer);

		const downloadLink = document.createElement('a');
		downloadLink.addEventListener('click', () => {
			clickDownload(modalImageMsg.File.ThumbnailURL);
		});

		const downloadIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		downloadIcon.setAttribute('height', '1em');
		downloadIcon.setAttribute('viewBox', '0 0 512 512');
		downloadIcon.innerHTML = '<path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/>';

		const downloadIconContainer = document.createElement('div');
		downloadIconContainer.className = 'iqchannels-modal_img_header-icon';
		downloadIconContainer.appendChild(downloadIcon);
		downloadLink.appendChild(downloadIconContainer);
		header.appendChild(downloadLink);

		const imageContainer = document.createElement('div');
		imageContainer.className = 'iqchannels-modal_img';
		imageContainer.style.backgroundImage = `url('${modalImageMsg.File.ThumbnailURL}')`;

		let footer;
		if (modalImageMsg.Text) {
			footer = document.createElement('div');
			footer.className = 'iqchannels-modal_img_footer';
			footer.textContent = modalImageMsg.Text;
		}

		modal.appendChild(header);
		modal.appendChild(imageContainer);
		if (footer) modal.appendChild(footer);

		document.body.appendChild(modal);
	}
}

function newChatEvent(type, data) {
	return {
		type: type,
		data: data
	};
}

window.IQChannelsWidget = IQChannelsWidget;
