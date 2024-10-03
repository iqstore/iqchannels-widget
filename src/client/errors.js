import App from "../app/App.vue";

export default class AppError {
  static fromApiError (error) {
    return new AppError(error.Code, error.Text);
  }

  static fromRequest (request) {
    return new AppError(ErrCodeHttpError, `${request.status}: ${request.statusText}`);
  }

  constructor (code, text) {
    this.code = code || 'internal_server_error';
    this.text = text || 'Internal server error';
  }

  toString () {
    return this.text;
  }

  notFound () {
    return this.code === ErrCodeNotFound;
  }

  forbidden () {
    return this.code === ErrCodeForbidden;
  }

  unauthorized () {
    return this.code === ErrCodeUnauthorized;
  }

  invalid () {
    return this.code === ErrCodeInvalid;
  }

  http () {
    return this.code === ErrCodeHttpError;
  }
}

export const ErrCodeNotFound = 'not_found';
export const ErrCodeForbidden = 'forbidden';
export const ErrCodeUnauthorized = 'unauthorized';
export const ErrCodeInvalid = 'invalid';
export const ErrCodeHttpError = 'http';
export const ErrCodeExpired = 'expired';
export const ErrBadRequest = 'bad_request'

export const ErrExpired = new AppError(ErrCodeExpired, 'Request timeout expired');
export const ErrMaxFileSize = new AppError(ErrBadRequest, 'Превышен максимально допустимый размер файла');
export const ErrFileImageDimensionsTooLarge = new AppError(ErrBadRequest, 'Слишком большая ширина или высота изображения');
export const ErrFileTypeNotAllowed = new AppError(ErrBadRequest, 'Запрещенный тип файла');
