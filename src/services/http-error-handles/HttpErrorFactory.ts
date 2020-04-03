import { IDatabaseError, IAppError, UseCaseError } from "@core";
import { InvalidFieldErrorInfo, HttpInvalidFieldError } from "./HttpInvalidFieldError";
import { HTTP_ERROR_CODE, BaseHttpError } from "./BaseHttpError";
import { HttpDatabaseError } from "./HttpDatabaseError";
import { ValidationError } from "class-validator";
import { HttpUseCaseError } from "./HttpUseCaseError";

class HttpErrorFactory {

  public error(error: UseCaseError<any> | ValidationError[] | ValidationError | IDatabaseError) {
    if (error instanceof UseCaseError) {
      return new HttpUseCaseError(error);
    }
    if (Array.isArray(error) && error[0] instanceof ValidationError) {
      return this.invalidFieldError(error);
    }
    if (error instanceof ValidationError) {
      return this.invalidFieldError([error]);
    }
    return this.internalServerError();
  }

  public invalidFieldError(validationFails: ValidationError[]) {
    return new HttpInvalidFieldError(this.convertErrorType(validationFails), HTTP_ERROR_CODE.bad_request);
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

  private convertErrorType(errors: ValidationError[]): InvalidFieldErrorInfo[] {
    const errorInfos: InvalidFieldErrorInfo[] = errors.map(err => {
      return {
        field: err.property,
        value: err.value,
        constraints: Object.values(err.constraints)
      }
    })
  
    return errorInfos;
  }
}

export const ErrorFactory = new HttpErrorFactory();
