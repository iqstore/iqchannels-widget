class Config {

  REQUEST_MESSAGES_LIMIT = 50;
  CLIENT_SESSION_COOKIE = 'client-session';

  constructor () {
    // this.apiBaseUrl = 'https://iqchannels.isimplelab.com/public/api/';
    this.apiBaseUrl = '/public/api/';
    this.apiVersion = 'v1';
  }

  apiUrl = (path) => this.apiBaseUrl + this.apiVersion + path;

  fileUrl = (fileID) => this.apiUrl(`/files/get/${fileID}`);

  imageUrl = (imageID, size) => this.apiUrl(`/files/image/${imageID}?size=${size}`);

}

export default new Config();

