import BaseController from "./BaseController";
import { IAuthenticate } from "@services/authenticate";
import { RequestHandler } from "express";
import { DomainAuthentication } from "@services/authenticate";
import { DomainAuthenticateService, ApplicationService } from "@modules/services/ApplicationService";
import { ErrorFactory } from "@services/http-error-handles";
import { ITaiKhoanRepository } from "@modules/taikhoan";

export default class LoginController extends BaseController {
  
  private authenticate: IAuthenticate<any>;
  
  constructor(route: string, repo: ITaiKhoanRepository) {
    super(route);
    this.authenticate = new DomainAuthentication(
      ApplicationService.getService(DomainAuthenticateService, repo));
  }

  protected initializeRoutes(): void {
    this.router.post(`${this.route}/nhanvien`, this.authenticateNhanVien());
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
      if (authenticateData.rememberPassword) {
        req.session.tk_id = result.data.id;
      }
      res.status(200).json(result);
    }
  }
}
