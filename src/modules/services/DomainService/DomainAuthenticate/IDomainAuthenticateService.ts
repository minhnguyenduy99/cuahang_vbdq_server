import { IDomainService, Result, IDatabaseError } from "@core";
import { TaiKhoan, TaiKhoanDTO } from "../../../taikhoan";
import InvalidAuthentication from "./InvalidAuthentication";



export default interface IDomainAuthenticateService {

  authenticate(tenDangNhap: string, matKhau: string): Promise<Result<TaiKhoanDTO, InvalidAuthentication>>;
}