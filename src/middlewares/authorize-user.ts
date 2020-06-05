import { RequestHandler } from "express";
import { ErrorFactory } from "@services/http-error-handles";
import { Dependency, DEPConsts } from "@dep";


/**
 * Form of token:
 * Bearer <token>
 */
export default function authorizeUser(resource?: string): RequestHandler {
  return async (req, res, next) => {
    let authResult = req.body.authenticate;
    let roleService = Dependency.Instance.getDomainService(DEPConsts.RoleService);
    const rs = resource || req.baseUrl.split('/').filter(val => val !== '')[0];
    let isUserAllowed = await roleService.isUserAllowed(authResult.tk_id, rs);
    if (!isUserAllowed) {
      return next(ErrorFactory.unauthorized());
    }
    next();
  }
}