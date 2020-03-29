import * as express from "express";
import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { ErrorFactory, InvalidFieldErrorInfo } from "@services/http-error-handles";


export default function validateBody(type: any, skipMissingProperties: boolean = false): express.RequestHandler {
  return async (req, res, next) => {
    const castBody = plainToClass(type, req.body);
    const errors = await validate(castBody, { skipMissingProperties })
    if (errors.length > 0) {
      const errorInfos = convertErrorType(errors);
      next(ErrorFactory.invalidFieldError(errorInfos));
    } else {
      req.body = castBody;
      next();
    }
  }
}

function convertErrorType(errors: ValidationError[]): InvalidFieldErrorInfo[] {
  const errorInfos: InvalidFieldErrorInfo[] = errors.map(err => {
    return {
      field: err.property,
      value: err.value,
      constraints: Object.values(err.constraints)
    }
  })

  return errorInfos;
}