class Config {
  REQUEST_MESSAGES_LIMIT = 50;
  CLIENT_SESSION_COOKIE = "client-session";

  constructor() {
    // this.apiBaseUrl = 'https://iqchannels.isimplelab.com/public/api/';
    this.apiBaseUrl = "/public/api/";
    this.apiVersion = "v1";
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  apiUrl = (path) => this.apiBaseUrl + this.apiVersion + path;

  fileUrl = (fileId) => this.apiUrl(`/files/get/${fileId}`);

  imageUrl = (imageId, size) => {
    var token = this.getCookie(this.CLIENT_SESSION_COOKIE);

    if (!token) {
      token = localStorage.getItem(this.CLIENT_SESSION_COOKIE)
    }

    const tokenParam = token ? `&x-client-token=${token}` : "&x-client-token=not-found";
    return this.apiUrl(`/files/image/${imageId}?size=${size}${tokenParam}`);
  };
}

export default new Config();
