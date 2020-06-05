import BaseController from "./BaseController";
import { IAuthenticate } from "@services/authenticate";
import { RequestHandler } from "express";
import { ErrorFactory } from "@services/http-error-handles";
import { Dependency, DEPConsts } from "@dep";
import { IRoleService } from "@modules/roles/shared";
import { IAccountAuthenticateService } from "@modules/taikhoan/shared";

export default class LoginController extends BaseController {
  
  private authenticate: IAccountAuthenticateService;
  private authorization: IRoleService;
  
  constructor(route: string) {
    super(route);
    this.authenticate = Dependency.Instance.getDomainService(DEPConsts.AccountAuthenticateService);
    this.authorization = Dependency.Instance.getDomainService(DEPConsts.RoleService);
  }

  protected initializeRoutes(): void {
    this.method("post", this.authenticateNhanVien(), "/nhanvien");
  }

  private authenticateNhanVien(): RequestHandler {
    return async (req, res, next) => {
      let { ten_dang_nhap: username, mat_khau: password } = req.body;
      const result = await this.authenticate.authenticate(username, password);
      if (!result.valid) {
        return next(ErrorFactory.unauthenticated(result.message));
      }
      let { id, loai_tk } = result.data;
      this.authorization.addUserRole(id, loai_tk);
      res.status(200).json(result);
    }
  }
}
