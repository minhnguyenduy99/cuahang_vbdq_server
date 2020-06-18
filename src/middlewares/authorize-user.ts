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
    let [rs, permission] = req.originalUrl.split(/[\\/?]/).filter(val => val !== '');
    rs = resource || rs;
    permission = permission ?? req.method.toLowerCase();
    let isUserAllowed = await roleService.isUserAllowed(authResult.tk_id, rs, permission);
    if (!isUserAllowed) {
      return next(ErrorFactory.unauthorized());
    }
    next();
  }
}