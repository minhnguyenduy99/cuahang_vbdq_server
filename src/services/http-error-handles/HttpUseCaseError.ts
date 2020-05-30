import { BaseHttpError, HTTP_ERROR_CODE } from "./BaseHttpError";
import { UseCaseError } from "@core";


export class HttpUseCaseError extends BaseHttpError {

  readonly type: string;
  readonly usecase: UseCaseError;

  public constructor(useCaseErr: UseCaseError, code: number = HTTP_ERROR_CODE.bad_request) {
    super(useCaseErr.message, code);
    this.usecase = useCaseErr;
  }

  public getErrorInfo() {
    return {
      code: this.code,
      error_code: this.usecase.code,
      message: this.message,
      ...this.usecase.obj
    }
  }
}