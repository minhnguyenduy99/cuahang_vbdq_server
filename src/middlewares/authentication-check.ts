import { RequestHandler } from "express";
import { ErrorFactory } from "@services/http-error-handles";
import { Dependency, DEPConsts } from "@dep";


/**
 * Form of token:
 * Bearer <token>
 */
export default function authenticationChecking(): RequestHandler {
  return async (req, res, next) => {
    const authService = Dependency.Instance.getDomainService(DEPConsts.AccountAuthenticateService);
    const token = req.headers.authorization;
    // token not found
    if (!token) {
      return next(ErrorFactory.unauthenticated());
    }
    const tokenParts = token.split(' ');
    const authResult = await authService.vertify(tokenParts[1]);
    // token error 
    if (!authResult) {
      return next(ErrorFactory.unauthenticated()); 
    }
    let isAuthenticated = await authService.isUserAuthenticated(authResult.tk_id);
    // The user has the token but has not login yet
    if (!isAuthenticated) {
      return next(ErrorFactory.unauthenticated());
    }
    req.body.authenticate = authResult; 
    next();
  }
}