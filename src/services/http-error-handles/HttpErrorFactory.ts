import { IDatabaseError, IAppError, BaseAppError } from "@core";
import { InvalidFieldErrorInfo, HttpInvalidFieldError } from "./HttpInvalidFieldError";
import { HTTP_ERROR_CODE, BaseHttpError } from "./BaseHttpError";
import { HttpDatabaseError } from "./HttpDatabaseError";

class HttpErrorFactory {

  public invalidFieldError(fields: InvalidFieldErrorInfo[]) {
    return new HttpInvalidFieldError(fields, HTTP_ERROR_CODE.bad_request);
  }

  public internalServerError() {
    return new BaseHttpError("Internal server error", HTTP_ERROR_CODE.server_error);
  }

  public databaseError(dbError: IDatabaseError) {
    return new HttpDatabaseError(dbError);
  }

  public unauthenticated(appErr: IAppError) {
    return new BaseHttpError(appErr.message, HTTP_ERROR_CODE.bad_request);
  }

  public general(dbError: IAppError, code: number = HTTP_ERROR_CODE.bad_request) {
    return new BaseHttpError(dbError.message, code);
  }
}

export const ErrorFactory = new HttpErrorFactory();
