import { RequestHandler } from "express";
import { ErrorFactory } from "@services/http-error-handles";


export default function authenticationChecking(fieldName: string): RequestHandler {
  return (req, res, next) => {
    // The session is uninitialized
    if (!req.session || !req.session[fieldName]) {
      return next(ErrorFactory.unauthenticated());
    }
    next();
  }
}