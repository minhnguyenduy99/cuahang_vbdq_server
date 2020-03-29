import * as express from "express";
import { NextFunction } from "connect";
import { BaseHttpError } from "@services/http-error-handles";

export default function handleError(
  error: BaseHttpError,
  req: express.Request,
  res: express.Response,
  next: NextFunction) {

  const errorData = error.getErrorInfo() || {
    code: error.code || 500,
    message: error.message || "Unhandled exception"
  }
  res.status(errorData.code).json(errorData);
}

