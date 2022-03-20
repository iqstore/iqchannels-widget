import EventEmitter from "event-emitter";
import jquery from "jquery";
import "./widget-normalize.scss";
import "./widget.scss";

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
  show: true,
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
  let show = iconOptions.show !== undefined ? iconOptions.show : defaultIconOptions.show;

  let style = {};
  if (iconOptions.color !== undefined) {
    style.color = iconOptions.color;
  }
  if (iconOptions.backgroundColor !== undefined) {
    style.backgroundColor = iconOptions.backgroundColor;
  }
  if (iconOptions.style !== undefined) {
    style = objectAssign(style, iconOptions.style);
  }

  return {
    show: show,
    style: style,
  }
}

class IQChannelsWidget extends EventEmitter {
  constructor({
    url = null,
    channel = 'support',
    credentials,
    mode = 'web',
    project,
    width = 280,
    padBody = true,
    requireName = true,
    iconOptions = {},
    DOMIdentifier
  }) {
    super();
    url = url ? url : BASE_URL;

    this.width = width;
    this.channel = channel;
    this.credentials = credentials || '';
    this.mode = mode === 'mobile' ? mode : 'web';
    this.project = project || '';
    this.padBody = padBody;
    this.requireName = requireName;
    this.pushToken = null;
    this.opened = false;
    this.DOMIdentifier = DOMIdentifier || null;
    iconOptions = cleanIconOptions(iconOptions);

    // Add elements

    this.frameContainer = jquery(`
<div id="iqchannels-widget-container">
    <div id="iqchannels-widget" style="width: ${this.width}px">
        <iframe 
            id="iqchannels-widget-iframe" 
            src="${url}"></iframe>
    </div>
</div>    
`);

    this.icon = jquery(`
<a href="#" id="iqchannels-widget-icon">
    <svg version="1.1" 
        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
        x="0px" y="0px" 
        viewBox="0 0 1000 1000" 
        enable-background="new 0 0 1000 1000" 
        xml:space="preserve"><g><path d="M500,867.5c-31.3,0-61.9-2.8-91.6-7.8L193.8,990V773.1C81.8,694.6,10,574.1,10,438.7C10,202,229.4,10,500,10c270.6,0,490,192,490,428.7C990,675.5,770.6,867.5,500,867.5z M500,71.2c-236.8,0-428.8,164.5-428.8,367.5c0,124.5,72.4,234.4,183,300.9l-1.9,142.1L396.5,795c33.2,7.1,67.8,11.2,103.5,11.2c236.8,0,428.8-164.5,428.8-367.5C928.8,235.8,736.8,71.2,500,71.2z M745,500c-33.8,0-61.3-27.4-61.3-61.3c0-33.8,27.4-61.2,61.3-61.2c33.8,0,61.3,27.4,61.3,61.2C806.3,472.6,778.8,500,745,500z M500,500c-33.8,0-61.3-27.4-61.3-61.3c0-33.8,27.4-61.2,61.3-61.2s61.3,27.4,61.3,61.2C561.3,472.6,533.8,500,500,500z M255,500c-33.8,0-61.3-27.4-61.3-61.3c0-33.8,27.4-61.2,61.3-61.2c33.8,0,61.3,27.4,61.3,61.2C316.3,472.6,288.8,500,255,500z"/></g></svg>
</a>`);

    this.icon.css('display', iconOptions.show ? 'block' : 'none');
    this.icon.css(iconOptions.style);

    jquery(document).ready(() => {
      jquery(document.body).append(this.icon);

      const widgetContaier = document.getElementById(this.DOMIdentifier);
      jquery(!this.DOMIdentifier || !widgetContaier ? document.body : widgetContaier).append(this.frameContainer);
      // Setup handlers
      jquery(window).on('message', this.onFrameMessage);

      this.icon.on('click', (e) => {
        e.preventDefault();
        this.toggle();
      });

      // Find and store frame window to post messages
      const frame = document.getElementById('iqchannels-widget-iframe');
      this.frameWindow = frame.contentWindow ? frame.contentWindow : frame.contentDocument.defaultView;

      jquery(frame).load(() => {
        const event = newChatEvent('init', {
          channel: this.channel,
          credentials: this.credentials,
          mode: this.mode,
          project: this.project,
          requireName: this.requireName,
          pushToken: this.pushToken
        });
        this.frameWindow.postMessage(JSON.stringify(event), '*');
      });
    });
  }

  open = (text) => {
    if (this.opened) {
      return;
    }

    this.opened = true;
    if (this.padBody) {
      jquery(document.body).css('padding-right', addPixels(jquery(document.body).css('padding-right'), this.width));
    }
    this.icon.css('right', addPixels(this.icon.css('right'), this.width));

    const event = newChatEvent('open');
    this.frameWindow.postMessage(JSON.stringify(event), '*');
    this.frameContainer.show();
    setTimeout(() => this.frameWindow.focus(), 200);
    this.emit('open');

    if (text) {
      this.appendText(text);
    }
  };

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
    this.frameWindow.postMessage(JSON.stringify(event), '*');
    this.frameContainer.hide();

    if (this.padBody) {
      jquery(document.body).css('padding-right', addPixels(jquery(document.body).css('padding-right'), -this.width));
    }
    this.icon.css('right', addPixels(this.icon.css('right'), -this.width));
    this.emit('close');
  };

  destroy = () => {
    this.close();

    jquery(this.frameContainer).remove();
    jquery(this.icon).remove();
  };

  onFrameMessage = (e) => {
    if (e.originalEvent.type !== 'message') {
      return;
    }
    const { type, data } = e.originalEvent.data;
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
        this.emit('longtap', data);
        break;

      case 'iqchannels-widget-rating':
        this.emit('rating', data);
        break;

      default:
        break;
        // console.log(`Unknown frame event: type=${type}, data=${data}`);
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
    const data = { type: "apns", token: token };
    const event = newChatEvent("push_token", data);

    if (this.frameWindow) {
      this.frameWindow.postMessage(JSON.stringify(event), '*');
    } else {
      this.pushToken = data;
    }
  };

  setAndroidPushToken = (token) => {
    const data = { type: "fcm", token: token };
    const event = newChatEvent("push_token", data);

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

  sendRatingData = (rating) => {
    const event = newChatEvent('get-rating', rating);
    this.frameWindow.postMessage(JSON.stringify(event), '*');
  }
}

function newChatEvent(type, data) {
  return {
    type: type,
    data: data
  }
}

window.IQChannelsWidget = IQChannelsWidget;
