import { IDomainService, Result } from "@core";
import { TaiKhoanDTO } from "..";

export default interface IAccountAuthenticateService extends IDomainService {

  authenticate(tenDangNhap: string, matKhau: string): Promise<Result<TaiKhoanDTO, InvalidAuthentication>>;
}

export class InvalidAuthentication extends Error {
  
  constructor() {
    super();
    this.message = "Tên đăng nhập hoặc mật khẩu không chính xác";
  }
}