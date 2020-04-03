import { BaseHttpError, HTTP_ERROR_CODE } from "./BaseHttpError";
import { UseCaseError } from "@core";


export class HttpUseCaseError extends BaseHttpError {

  readonly type: string;

  public constructor(useCaseErr: UseCaseError<any>, code: number = HTTP_ERROR_CODE.bad_request) {
    super(useCaseErr.message, code);
    this.type = useCaseErr.usecase;
  }

  public getErrorInfo() {
    return {
      code: this.code,
      type: this.type,
      message: this.message
    }
  }
}