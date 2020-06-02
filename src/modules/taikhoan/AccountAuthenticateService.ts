import { TaiKhoan } from "@modules/taikhoan";
import { FailResult, SuccessResult } from "@core";
import { CreateType } from "@modules/core";
import { IAccountAuthenticateService, InvalidAuthentication, ITaiKhoanService } from ".";
import { Dependency, DEPConsts } from "@dep";


export default class AccountAuthenticateService implements IAccountAuthenticateService {

  private taikhoanService: ITaiKhoanService;
  
  constructor() {
    this.taikhoanService = Dependency.Instance.getDomainService(DEPConsts.TaiKhoanService);
  }

  async authenticate(tenDangNhap: string, matKhau: string) {
    const getTaiKhoan = await this.taikhoanService.findTaiKhoanByTenDangNhap(tenDangNhap);
    if (getTaiKhoan.isFailure) {
      return FailResult.fail(new InvalidAuthentication());
    }
    const taikhoan = getTaiKhoan.getValue();
    const isMatKhauValid = await this.validateMatKhau(taikhoan, matKhau);
    if (!isMatKhauValid) {
      return FailResult.fail(new InvalidAuthentication());
    }
    return SuccessResult.ok(taikhoan.serialize(CreateType.getGroups().toAppRespone));
  }

  private async validateMatKhau(taikhoan: TaiKhoan, matkhau: string) {
    if (!taikhoan) {
      return false;
    } 
    return taikhoan.isMatKhauValid(matkhau);
  }
}