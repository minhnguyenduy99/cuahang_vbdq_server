import { BaseHttpError, HTTP_ERROR_CODE } from "./BaseHttpError";
import { UseCaseError } from "@core";


export class HttpUseCaseError extends BaseHttpError {

  readonly type: string;
  readonly usecase: UseCaseError<any>;

  public constructor(useCaseErr: UseCaseError<any>, code: number = HTTP_ERROR_CODE.bad_request) {
    super(useCaseErr.message, code);
    this.usecase = useCaseErr;
  }

  public getErrorInfo() {
    return {
      code: this.code,
      ...this.usecase.getErrorInfo()
    }
  }
}