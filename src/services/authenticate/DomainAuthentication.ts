import { TaiKhoanDTO, ITaiKhoanRepository } from "@modules/taikhoan";
import { IAuthenticate } from ".";
import { IDomainAuthenticateService } from "@modules/services";
import AuthenticateResult from "./AuthenticateResult";

interface AuthenticateData {
  username: string;
  password: string;
}

export default class DomainAuthentication implements IAuthenticate<AuthenticateData> {

  private constructor(
    private authService: IDomainAuthenticateService
  ) {
  }

  async authenticate(data: AuthenticateData): Promise<AuthenticateResult> {
    const authenticateResult = await this.authService.authenticate(data.username, data.password);
    if (authenticateResult.isFailure) {
      return {
        valid: false,
        message: authenticateResult.error.message,
        data: null
      };
    }
    const taikhoan = authenticateResult.getValue();
    return {
      valid: taikhoan ? true: false,
      message: taikhoan ? "Đăng nhập thành công" : "Tên đăng nhập hoặc mật khẩu không đúng",
      data: taikhoan
    }
  }

  static create(authService: IDomainAuthenticateService) {
    return new DomainAuthentication(authService);
  }
}