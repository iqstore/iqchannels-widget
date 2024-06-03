/* globals EventSource, FormData */

import 'es6-promise/auto';
import 'event-source-polyfill';
import jquery from 'jquery';
import jsSHA from 'jssha';
import config from '../config';
import AppError, { ErrExpired } from './errors';
import Relations from './relations';
import Request from './request';

const XClientAuthorizationHeader = 'X-Client-Authorization';

class Client {
  constructor (apiUrl) {
    this.sendQueue = [];
    this.sending = null;

    this.authToken = null;
    this.authSessionID = null;
    this.multiClientAuth = {};
  }

  clearAuth () {
    this.authToken = null;
    this.authSessionID = null;
  }

  setAuth (auth) {
    if (!auth) {
      return;
    }
    if (!auth.Session) {
      return;
    }

    let s = auth.Session;
    this.authToken = s.Token;
    this.authSessionID = s.Id;
  }

  setMultiAuth (channel) {
    if (channel && this.multiClientAuth[channel]) {
      this.setAuth(this.multiClientAuth[channel]);
    } else {
      console.error('Неверный канал');
    }
  }

  post (path, data) {
    let headers = {};
    if (this.authToken) {
      headers[XClientAuthorizationHeader] = this.authToken;
    }

    return new Promise((resolve, reject) => {
      jquery.ajax({
        type: 'POST',
        url: config.apiUrl(path),
        crossDomain: true,
        data: JSON.stringify(data),
        dataType: 'json',
        withCredentials: true,
        contentType: 'application/json',
        headers: headers,
        success: response => this.handleResponse(response, resolve, reject),
        error: request => reject(AppError.fromRequest(request))
      });
    });
  }

  get (path, data) {
    let headers = {};
    if (this.authToken) {
      headers[XClientAuthorizationHeader] = this.authToken;
    }

    return new Promise((resolve, reject) => {
      jquery.ajax({
        type: 'GET',
        url: config.apiUrl(path),
        crossDomain: true,
        data: JSON.stringify(data),
        dataType: 'json',
        withCredentials: true,
        contentType: 'application/json',
        headers: headers,
        success: response => this.handleResponse(response, resolve, reject),
        error: request => reject(AppError.fromRequest(request))
      });
    });
  }

  xhr (onProgress) {
    const xhr = jquery.ajaxSettings.xhr();
    if (xhr.upload) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress(Math.floor((e.loaded / e.total) * 100));
        }
      }, false);
    }
    return xhr;
  }

  multipart (path, data, onSuccess, onError, onProgress) {
    let headers = {};
    if (this.authToken) {
      headers[XClientAuthorizationHeader] = this.authToken;
    }

    return jquery.ajax({
      type: 'POST',
      url: config.apiUrl(path),
      crossDomain: true,
      data: data,
      withCredentials: true,
      headers: headers,
      xhr: () => this.xhr(onProgress),
      success: response => this.handleResponse(response, onSuccess, onError),
      error: request => onError(AppError.fromRequest(request)),
      cache: false,
      contentType: false,
      processData: false
    });
  }

  handleResponse (response, onSuccess, onError) {
    if (response.OK) {
      return onSuccess(response);
    }
    const error = AppError.fromApiError(response.Error);
    onError(error);
  }

  anonymousAuth () {
    const options = { shouldRetry: (error) => !error.unauthorized() };
    return this._enqueueRequest('/clients/anonymous/auth', null, options)
      .then(response => {
        let auth = response.Result;
        this.setAuth(auth);

        return auth;
      });
  }

  anonymousSignup (name, channel) {
    const data = { Name: name, Channel: channel };
    const options = { shouldRetry: (error) => error.http() };

    return this._enqueueRequest('/clients/anonymous/signup', data, options)
      .then(response => {
        let auth = response.Result;
        this.setAuth(auth);

        return auth.Client;
      });
  }

  // Deprecated
  anonymousCreate (name, channel) {
    const data = { Name: name, Channel: channel };
    const options = { shouldRetry: (error) => error.http() };

    return this._enqueueRequest('/clients/anonymous/create', data, options)
      .then(response => {
        let auth = response.Result;
        this.setAuth(auth);

        return auth.Client;
      });
  }

  authorize (credentials, channel) {
    const data = {
      Credentials: credentials,
      Channel: channel
    };
    const options = { shouldRetry: (error) => !(error.unauthorized() || error.invalid()) };

    return this._enqueueRequest('/clients/integration_auth', data, options)
      .then(response => {
        let auth = response.Result;
        if (channel) {
          this.multiClientAuth[channel] = auth;
        }
        this.setAuth(auth);

        return auth.Client;
      });
  }

  // Deprecated.
  authorizeInProject (credentials, project) {
    const data = {
      Credentials: credentials,
      Project: project
    };
    const options = { shouldRetry: (error) => !(error.unauthorized() || error.invalid()) };

    return this._enqueueRequest('/clients/integration_auth_in_project', data, options)
      .then(response => {
        let auth = response.Result;
        this.setAuth(auth);

        return auth.Client;
      });
  }

  refreshClient (credentials) {
    const data = {
      Credentials: credentials
    };

    return this.post('/clients/integration_refresh', data)
      .then(response => response.Result.Client);
  }

  channelMessages (channel, chatType, searchTerm, fromId, toId) {
    const data = { ChatType: chatType, Limit: config.REQUEST_MESSAGES_LIMIT, Q: searchTerm, FromId: fromId, ToId: toId };
    return this._enqueueRequest(`/chats/channel/messages/${channel}`, data)
      .then(response => new Relations(config, response.Rels).messages(response.Result));
  }

  channelTyping (channel, chatType) {
    const data = { ChatType: chatType };
    const options = { timeout: 5000 };
    return this._enqueueRequest(`/chats/channel/typing/${channel}`, data, options);
  }

  channelSend (channel, message) {
    return this._enqueueRequest(`/chats/channel/send/${channel}`, message);
  }

  listTicketsByClient (channel, clientId, query) {
    return this._enqueueRequest(`/chats/channel/tickets/existing/${channel}`, { ClientId: clientId, Query: query });
  }

  getPoll (query) {
    return this._enqueueRequest(`/ratings/query_poll`, { Query: query }, { shouldRetry: (error) => !error });
  }

  sendPoll (input) {
    return this._enqueueRequest(`/ratings/send_poll`, { RatingPollClientAnswerInput: input });
  }

  finishPoll (ratingId, pollId, rated) {
    return this._enqueueRequest(`/ratings/finish_poll`, { RatingId: ratingId, RatingPollId: pollId, Rated: rated });
  }

  getChatSettings (channel) {
    return this._enqueueRequest(`/chats/channel/chat/get_settings/${channel}`, {}, { shouldRetry: (error) => !error });
  }
  openSystemChat (channel) {
    return this._enqueueRequest(`/chats/channel/system_chats/send/${channel}`);
  }

  checkIfAudioMsgEnabled (channel) {
    return this._enqueueRequest(`/chats/channel/audio_messages_enabled/${channel}`, {}, { shouldRetry: (error) => !error });
  }
  getWidgetGreetings (channel) {
    return this._enqueueRequest(`/widget/greetings/${channel}`, {}, { shouldRetry: (error) => !error });
  }

  acceptProductMessage (messageId, productId) {
    return this._enqueueRequest(`/chats/messages/accept_product`, { MessageId: messageId, ProductId: productId });
  }

  declineProductMessage (messageId, productId) {
    return this._enqueueRequest(`/chats/messages/decline_product`, { MessageId: messageId, ProductId: productId });
  }

  channelMessagesRead (messagesIds) {
    return this._enqueueRequest(`/chats/messages/read`, messagesIds);
  }

  channelMessagesListen (messageId) {
    return this._enqueueRequest(`/chats/messages/listen`, messageId);
  }

  channelMessagesReceived (messagesIds) {
    return this._enqueueRequest(`/chats/messages/received`, messagesIds);
  }

  version () {
    return this._enqueueRequest(`/chats/version`, {}, { shouldRetry: (error) => !error });
  }

  channelPushToken (channel, type, token) {
    switch (type) {
      case 'apns':
        return this.channelAPNSToken(channel, token);

      case 'fcm':
        return this.channelFCMToken(channel, token);

      default:
        return this.channelAPNSToken(channel, token);
    }
  }

  channelAPNSToken (channel, token) {
    let body = {
      Type: 'apns',
      Token: token
    };
    return this._enqueueRequest(`/push/channel/apns/${channel}`, body);
  }

  channelFCMToken (channel, token) {
    let body = {
      Type: 'fcm',
      Token: token
    };
    return this._enqueueRequest(`/push/channel/fcm/${channel}`, body);
  }

  rateRating (ratingId, value, comment) {
    const request = {
      RatingId: ratingId,
      Rating: {
        Value: value,
        Comment: comment
      }
    };
    return this._enqueueRequest(`/ratings/rate`, request)
      .then(response => new Relations(config, response.Rels).rating(response.Result));
  }

  ignoreRating (ratingId) {
    const request = { RatingId: ratingId };
    return this._enqueueRequest(`/ratings/ignore`, request)
      .then(response => new Relations(config, response.Rels).rating(response.Result));
  }

  getInfoLinkByChannel (channel) {
    return this._enqueueRequest(`/info_requests/${channel}`);
  }

  sendInfo (info) {
    const request = {
      RequestId: info.Id,
      ClientId: info.ClientId,
      ClientConsent: info.ClientConsent,
      Form: info.Form
    };
    return this._enqueueRequest(`/info_requests/respond`, request)
      .then(response => new Relations(config, response.Rels).infoRequest(response.Result));
  }

  ignoreInfo (requestId) {
    const request = { RequestId: requestId };
    return this._enqueueRequest(`/info_requests/ignore`, request)
      .then(response => new Relations(config, response.Rels).infoRequest(response.Result));
  }

  fileToken (fileId) {
    const request = { FileId: fileId };
    return this.post(`/files/token`, request).then(response => {
      let token = response.Result;
      return token.Token;
    });
  }

  fileSignedUrl (fileId) {
    return this.fileToken(fileId).then(token => {
      let path = `/files/get/${fileId}?token=${token}`;
      let fullpath = config.apiUrl(path);
      let url = window.location.protocol + '//' + window.location.host + fullpath;
      return url;
    });
  }

  getFile (fileId) {
    return this.get(`/files/get_file/${fileId}`, {});
  }

  uploadFile (file, onSuccess, onError, onProgress) {
    let type = 'file';
    if (file.type.startsWith('image/')) {
      type = 'image';
    }

    if (file.type.toString().startsWith('audio')) {
      type = 'audio';
    }
    const data = new FormData();
    data.append('Type', type);
    data.append('File', file);

    const _onSuccess = (response) => {
      const data = new Relations(config, response.Rels).file(response.Result);
      onSuccess(data);
    };

    return this.multipart('/files/upload', data, _onSuccess, onError, onProgress);
  }

  channelListen (channel, chatType, lastEventId, onMessage, onError) {
    let token = this._encryptToken();
    let url = config.apiUrl(`/sse/chats/channel/events/${channel}`);

    if (chatType || lastEventId || token) {
      url += '?';
    }

    if (chatType) {
      url += `ChatType=${chatType}`;
    }

    if (lastEventId) {
      if (chatType) {
        url += '&';
      }
      url += `LastEventId=${lastEventId}`;
    }

    if (token) {
      if (chatType || lastEventId) {
        url += '&';
      }
      url += `x-client-token=${token}`;
    }

    const source = new EventSource(url, { withCredentials: true });
    source.addEventListener('message', message => {
      try {
        const response = JSON.parse(message.data);
        if (!response.OK) {
          throw AppError.fromApiError(response.Error);
        }
        const events = new Relations(config, response.Rels).events(response.Result);
        if (events.length) {
          onMessage(events);
        }
      } catch (error) {
        source.close();
        onError(error);
      }
    });
    source.addEventListener('error', error => {
      source.close();
      onError(error);
    });
    return source;
  }

  _enqueueRequest (url, data, options = { timeout: 0, shouldRetry: null }) {
    const req = new Request(url, data, options);
    const promise = new Promise((resolve, reject) => {
      req.onError(reject);
      req.onDone(resolve);
    });
    this.sendQueue.push(req);
    this._triggerFlush({});
    return promise;
  }

  _nextRequest () {
    while (this.sendQueue.length) {
      const req = this.sendQueue.shift();
      if (!req.expired()) return req;
      req.error(ErrExpired);
    }
    return null;
  }

  _triggerFlush ({ timeout = 1, clearSending = false }) {
    setTimeout(() => {
      if (clearSending) {
        this.sending = null;
      }
      this._flush();
    }, timeout);
  }

  _flush = () => {
    if (this.sending) return;

    const req = this._nextRequest();
    if (!req) return;

    this.sending = this
      .post(req.url, req.data)
      .then(response => {
        req.done(response);
        this._triggerFlush({ clearSending: true });
      })
      .catch(error => {
        const shouldRetry = req.shouldRetry(error);
        if (shouldRetry) {
          const timeout = req.retryTimeout();
          console.log(`Request to ${req.url} failed, retry in ${timeout}ms, error: ${error}`);
          this.sendQueue.unshift(req);
          this._triggerFlush({ timeout: timeout, clearSending: true });
        } else {
          console.log(`Request to ${req.url} failed, error: ${error}`);
          req.error(error);
          this._triggerFlush({ clearSending: true });
        }
      });
  }

  // _encryptToken returns signed x-client-token for SSE connections.
  _encryptToken () {
    if (!this.authToken || !this.authSessionID) {
      return;
    }

    // Combine a session and the current timestamp.
    let time = +new Date();
    let token = { SessionID: this.authSessionID, Time: time };
    let text = JSON.stringify(token);

    // Sign them as JSON using the auth token.
    // eslint-disable-next-line new-cap
    let hmac = new jsSHA('SHA-1', 'TEXT', {
      hmacKey: { value: this.authToken, format: 'TEXT' }
    });
    hmac.update(text);
    let sign = hmac.getHash('HEX');

    // Convert to JSON.
    let signed = {
      Token: text,
      Sign: sign
    };
    let json = JSON.stringify(signed);

    // Base64 encode the result.
    // eslint-disable-next-line no-undef
    let b64 = btoa(json);
    return b64;
  }
}

export default new Client();
