import { IDomainService, Result, IDatabaseError } from "@core";
import { TaiKhoan, TaiKhoanDTO } from "../../../taikhoan";
import { IApplicationService } from "..";



export default interface IDomainAuthenticateService extends IApplicationService {

  authenticate(tenDangNhap: string, matKhau: string): Promise<Result<TaiKhoanDTO, IDatabaseError>>;
}