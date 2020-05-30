import BaseController from "./BaseController";
import { IAuthenticate } from "@services/authenticate";
import { RequestHandler } from "express";
import { ErrorFactory } from "@services/http-error-handles";
import { Dependency, DEPConsts } from "@dep";

export default class LoginController extends BaseController {
  
  private authenticate: IAuthenticate<any>;
  
  constructor(route: string) {
    super(route);
    this.authenticate = Dependency.Instance.getApplicationSerivce(DEPConsts.DomainAuthentication);
  }

  protected initializeRoutes(): void {
    this.method("post", this.authenticateNhanVien(), "/nhanvien");
  }

  private authenticateNhanVien(): RequestHandler {
    return async (req, res, next) => {
      const authenticateData = {
        username: req.body.ten_dang_nhap,
        password: req.body.mat_khau,
        rememberPassword: req.body.remember_password
      };
      const result = await this.authenticate.authenticate(authenticateData);
      if (!result.valid) {
        return next(ErrorFactory.unauthenticated(result.message));
      }
      res.status(200).json(result);
    }
  }
}
