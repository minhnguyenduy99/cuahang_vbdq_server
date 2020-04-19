import IDomainAuthenticateService from "./IDomainAuthenticateService";
import { TaiKhoan, ITaiKhoanRepository } from "@modules/taikhoan";
import { FailResult, SuccessResult, DomainService } from "@core";
import CreateType from "@create_type";
import { TaiKhoanService } from "@modules/services/DomainService";
import InvalidAuthentication from "./InvalidAuthentication";


export default class DomainAuthenticateService implements IDomainAuthenticateService {
  
  private taikhoanService: TaiKhoanService;

  constructor(
    taikhoanRepo: ITaiKhoanRepository
  ) {
    this.taikhoanService = DomainService.getService(TaiKhoanService, taikhoanRepo);
  }

  async authenticate(tenDangNhap: string, matKhau: string) {
    const getTaiKhoan = await this.taikhoanService.findTaiKhoanByTenDangNhap(tenDangNhap);
    if (getTaiKhoan.isFailure) {
      return FailResult.fail(new InvalidAuthentication());
    }
    const taikhoan = getTaiKhoan.getValue();
    const isMatKhauValid = await this.validateMatKhau(taikhoan, matKhau);
    if (!isMatKhauValid) {
      return SuccessResult.ok(null);
    }
    return SuccessResult.ok(taikhoan.serialize(CreateType.getGroups().toAppRespone));
  }

  private async validateMatKhau(taikhoan: TaiKhoan, matkhau: string) {
    if (!taikhoan) {
      return;
    } 
    return taikhoan.isMatKhauValid(matkhau);
  }
}