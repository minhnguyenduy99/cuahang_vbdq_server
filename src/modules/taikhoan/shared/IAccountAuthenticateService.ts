import { IDomainService } from "@core";
import AuthenticateResult from "./AuthenticateResult";
import VertifyResult from "./VertifyResult";

export default interface IAccountAuthenticateService extends IDomainService {

  authenticate(tenDangNhap: string, matKhau: string): Promise<AuthenticateResult>;

  isUserAuthenticated(taikhoanId: string): Promise<boolean>;

  vertify(token: string): Promise<VertifyResult>;
}

export class InvalidAuthentication extends Error {
  
  constructor() {
    super();
    this.message = "Tên đăng nhập hoặc mật khẩu không chính xác";
  }
}