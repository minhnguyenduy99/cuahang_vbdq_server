import * as express from "express";


export default function handleError(): express.ErrorRequestHandler {
  return (error, req, res, next) => {
    const errorData = error.getErrorInfo() || {
      code: error.code || 500,
      message: error.message || "Unhandled exception"
    }
    res.status(errorData.code).json(errorData);
  }
}

