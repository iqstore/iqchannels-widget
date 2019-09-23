import { retryTimeout } from '../lib/timeout';

export default class Request {
  constructor (url, data, options = {}) {
    this.url = url;
    this.data = data;
    this.retryAttempt = 0;
    this.expireAt = null;
    this.doneCb = null;
    this.errorCb = null;

    const { timeout, shouldRetry } = options;
    if (timeout) {
      const expireAt = new Date();
      expireAt.setSeconds(expireAt.getSeconds() + timeout / 1000);
      this.expireAt = expireAt;
    }

    this.shouldRetryCb = shouldRetry;
  }

  shouldRetry (error) {
    return this.shouldRetryCb ? this.shouldRetryCb(error) : true;
  }

  retryTimeout () {
    return retryTimeout(this.retryAttempt++);
  }

  expired () {
    return !!(this.expireAt && this.expireAt <= new Date());
  }

  onDone (cb) {
    this.doneCb = cb;
  }

  onError (cb) {
    this.errorCb = cb;
  }

  done (response) {
    this.doneCb && this.doneCb(response);
  }

  error (error) {
    this.errorCb && this.errorCb(error);
  }
}
