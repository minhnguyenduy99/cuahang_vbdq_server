
export const HTTP_ERROR_CODE = {
  bad_request: 400,
  resource_not_found: 404,
  unauthorized: 401,
  server_error: 500
}

export class BaseHttpError extends Error {

  readonly code: number;

  constructor(message: string, code: number = HTTP_ERROR_CODE.server_error) {
    super(message);
    this.code = code;
  }

  getErrorInfo(): any {
    return {
      code: this.code,
      message: this.message
    }
  }
}