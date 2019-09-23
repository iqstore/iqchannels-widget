class Config {

  REQUEST_MESSAGES_LIMIT = 100;
  CLIENT_SESSION_COOKIE = 'client-session';

  constructor () {
    this.apiBaseUrl = '/public/api/';
    this.apiVersion = 'v1';
  }

  apiUrl = (path) => this.apiBaseUrl + this.apiVersion + path;

  fileUrl = (fileId) => this.apiUrl(`/files/get/${fileId}`);

  imageUrl = (imageId, size) => this.apiUrl(`/files/image/${imageId}?size=${size}`);

}

export default new Config();

