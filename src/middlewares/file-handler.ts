import { RequestHandler } from "express";
import { Dependency, DEPConsts } from "@dep";

export default function fileHandler(fieldName: string): RequestHandler[] {
  return [
    Dependency.Instance.getApplicationSerivce(DEPConsts.ImageLoader).handlerFile(fieldName),
    (req, res, next) => {
      req.body[fieldName] = req.file || req.body[fieldName];
      next();
    }
  ]
}