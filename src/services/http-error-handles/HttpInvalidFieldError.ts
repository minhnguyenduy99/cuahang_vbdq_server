import{ BaseHttpError, HTTP_ERROR_CODE } from "./BaseHttpError";

export interface InvalidFieldErrorInfo {
  field: string;
  value?: any;
  constraints?: string[];
}

export class HttpInvalidFieldError extends BaseHttpError {
  readonly fields: InvalidFieldErrorInfo[];
  readonly error_code: string = "INV_001";

  constructor(fields: InvalidFieldErrorInfo[], code: number = HTTP_ERROR_CODE.bad_request) {
    super("Invalid data", code);
    this.fields = fields;
  }

  getErrorInfo(): any {
    return {
      message: this.message,
      code: this.code,
      error_code: this.error_code,
      error_fields: this.fields
    }
  }
}