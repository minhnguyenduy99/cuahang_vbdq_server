import * as express from "express";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { ErrorFactory } from "@services/http-error-handles";

export default class RequestValidator {

  static validateBody(type: any, skipMissingProperties: boolean = false): express.RequestHandler {
    return async (req, res, next) => {
      const castBody = plainToClass(type, req.body);
      const errors = await validate(castBody, { skipMissingProperties })
      if (errors.length > 0) {
        next(ErrorFactory.invalidFieldError(errors));
      } else {
        req.body = { castBody, ...req.body };
        next();
      }
    }
  }

  static validateParams(type: any, skipMissingProperties: boolean = false): express.RequestHandler {
    return async (req, res, next) => {
      const castParams = plainToClass(type, req.params);
      const errors = await validate(castParams, { skipMissingProperties })
      if (errors.length > 0) {
        next(ErrorFactory.invalidFieldError(errors));
      } else {
        req.body = { params: castParams, ...req.body };
        next();
      }
    }
  }
}