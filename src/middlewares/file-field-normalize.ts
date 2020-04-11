import { RequestHandler } from "express";


export default function normalizeFileField(fieldName: string, subField: string): RequestHandler {
  return (req, res, next) => {
    const subFieldValue = req.body[fieldName][subField];
    if (!subFieldValue || !subFieldValue.ext) {
      return next();
    }
    req.body[fieldName] = subFieldValue;
    next();
  }
}