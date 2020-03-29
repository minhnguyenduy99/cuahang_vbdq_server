import { BaseHttpError, HTTP_ERROR_CODE } from "./BaseHttpError";
import { IDatabaseError } from "@core";


export class HttpDatabaseError extends BaseHttpError {

  readonly type: string;

  public constructor(appDBError: IDatabaseError, code: number = HTTP_ERROR_CODE.bad_request) {
    super(appDBError.message, code);
    this.type = appDBError.type;
  }

  public getErrorInfo() {
    return {
      code: this.code,
      type: this.type,
      message: this.message
    }
  }
}