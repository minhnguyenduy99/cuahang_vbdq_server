import { RequestHandler } from "express";
import { DomainAuthentication } from "@services/authenticate";
import { ErrorFactory } from "@services/http-error-handles";
import { ApplicationService } from "@core";


/**
 * Form of token:
 * Bearer <token>
 */
export default function authenticationChecking(): RequestHandler {
  return async (req, res, next) => {
    const authService = ApplicationService.getService(DomainAuthentication);
    const token = req.headers.authorization;
    if (!token) {
      return next(ErrorFactory.unauthenticated());
    }
    const tokenParts = token.split(' ');
    const isAuthenticated = await authService.verifiedByToken(tokenParts[1]);
    if (!isAuthenticated) {
      return next(ErrorFactory.unauthenticated()); 
    }
    next();
  }
}