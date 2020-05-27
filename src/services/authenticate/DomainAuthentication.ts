import jwt from "jsonwebtoken";
import { IAuthenticate } from ".";
import { IAccountAuthenticateService } from "@modules/services/Shared";
import AuthenticateResult from "./AuthenticateResult";
import { ApplicationService, IAppSettings } from "@core";
import { Dependency, DEPConsts } from "@dep";
import { TaiKhoanDTO } from "@modules/taikhoan";

interface AuthenticateData {
  username: string;
  password: string;
}

interface AuthenticateConfigData {
  secretKey: string;
}

export default class DomainAuthentication extends ApplicationService<AuthenticateConfigData> implements IAuthenticate<AuthenticateData> {

  private authService: IAccountAuthenticateService;

  constructor(appSettings: IAppSettings) {
    super(appSettings);
    this.authService = Dependency.Instance.getDomainService(DEPConsts.AccountAuthenticateService);
  }

  protected getAppSettings(settings: IAppSettings): AuthenticateConfigData {
    return {
      secretKey: settings.getValue("authPrivateKey") || ""
    }
  }

  async authenticate(data: AuthenticateData): Promise<AuthenticateResult<TaiKhoanDTO>> {
    const authenticateResult = await this.authService.authenticate(data.username, data.password);
    if (authenticateResult.isFailure) {
      return {
        valid: false,
        message: authenticateResult.error.message,
        data: null
      };
    }
    const taikhoan = authenticateResult.getValue();
    const token = jwt.sign(taikhoan.id, this.serviceData.secretKey);
    return {
      valid: taikhoan ? true: false,
      message: taikhoan ? "Đăng nhập thành công" : "Tên đăng nhập hoặc mật khẩu không đúng",
      data: taikhoan,
      token: token
    }
  }

  async verifiedByToken(token: string): Promise<boolean> {
    try {
      jwt.verify(token, this.serviceData.secretKey);
      return true;
    } catch (err) {
      return false;
    }
  }
}