import { RequestHandler } from "express";
import { Dependency, DEPConsts } from "@dep";
import { ErrorFactory } from "@services/http-error-handles";

type GetUserIDFunction = (req: any, res: any) => string;

export default function authorize(
  resource:string = null, 
  permission: string = null, 
  getUserID: GetUserIDFunction
): RequestHandler {

  return async (req, res, next) => {
    const rs     = resource   || req.baseUrl.split('/').filter(val => val !== '')[0];
    const pms    = permission || req.path.split('/').filter(val => val !== '')[0] || req.method.toLowerCase();
    const id     = getUserID(req, res);

    let authorization = Dependency.Instance.getApplicationSerivce(DEPConsts.AuthorizationService);
    
    let isAllowed = await authorization.isAllowed(id, rs, pms);
    if (!isAllowed) {
      return next(ErrorFactory.unauthorized());
    }
    next();
  }
}