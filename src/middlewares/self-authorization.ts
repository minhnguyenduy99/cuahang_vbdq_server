import { RequestHandler } from "express";
import { ErrorFactory } from "@services/http-error-handles";

type GetIdCallback = (req: any) => string;

export default function selfAuthorization(requestId: string | GetIdCallback): RequestHandler {
  return (req, res, next) => {
    let userId = req.body.authenticate.tk_id;
    let id = (<GetIdCallback>requestId)(req) || <string>requestId;
    if (id !== userId) {
      return next(ErrorFactory.unauthorized());
    }
    next();
  }
}