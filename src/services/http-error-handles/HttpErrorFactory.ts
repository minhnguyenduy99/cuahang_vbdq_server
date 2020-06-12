import { IDatabaseError, IAppError, UseCaseError, DomainServiceError } from "@core";
import { ValidationError } from "class-validator";
import { InvalidFieldErrorInfo, HttpInvalidFieldError } from "./HttpInvalidFieldError";
import { HTTP_ERROR_CODE, BaseHttpError } from "./BaseHttpError";
import { HttpDatabaseError } from "./HttpDatabaseError";
import { HttpUseCaseError } from "./HttpUseCaseError";
import HttpDomainServiceError from "./HttpDomainError";

class HttpErrorFactory {

  public error(error: UseCaseError | ValidationError[] | ValidationError | IDatabaseError | DomainServiceError) {
    if (error instanceof UseCaseError) {
      return new HttpUseCaseError(error);
    }
    if (Array.isArray(error) && error[0] instanceof ValidationError) {
      return this.invalidFieldError(error);
    }
    if (error instanceof ValidationError) {
      return this.invalidFieldError([error]);
    }
    if (error instanceof DomainServiceError) {
      return this.domainService(error);
    }
    return this.internalServerError();
  }

  public resourceNotFound(msg?: string) {
    return new BaseHttpError(msg || "Resource not found", HTTP_ERROR_CODE.resource_not_found);
  }

  public invalidFieldError(validationFails: ValidationError[]) {
    return new HttpInvalidFieldError(this.convertErrorType(validationFails), HTTP_ERROR_CODE.bad_request);
  }

  public internalServerError() {
    return new BaseHttpError("Internal server error", HTTP_ERROR_CODE.server_error);
  }

  public databaseError(dbError: IDatabaseError) {
    return new HttpDatabaseError(dbError, HTTP_ERROR_CODE.server_error);
  }

  public domainService(domainError: DomainServiceError, code: number = HTTP_ERROR_CODE.bad_request) {
    return new HttpDomainServiceError(domainError, code);
  }

  public unauthorized() {
    return new BaseHttpError("User is unauthorized", HTTP_ERROR_CODE.bad_request);
  }

  public unauthenticated(message?: string) {
    return new BaseHttpError(message || "Unauthenticated", HTTP_ERROR_CODE.unauthenticated);
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
