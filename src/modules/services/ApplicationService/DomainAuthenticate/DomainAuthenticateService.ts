import IDomainAuthenticateService from "./IDomainAuthenticateService";
import { TaiKhoan, ITaiKhoanRepository } from "@modules/taikhoan";
import { FailResult, SuccessResult } from "@core";
import CreateType from "@create_type";
import IdentityNotFound from "./InvalidAuthentication";


export default class DomainAuthenticateService implements IDomainAuthenticateService {
  
  constructor(
    private repo: ITaiKhoanRepository
  ) {

  }

  async authenticate(tenDangNhap: string, matKhau: string) {
    const getTaiKhoan = await this.repo.findTaiKhoan(tenDangNhap);
    const taikhoanDTO = getTaiKhoan.getValue();
    if (getTaiKhoan.isFailure) {
      return FailResult.fail(getTaiKhoan.error);
    }
    if (!taikhoanDTO) {
      return SuccessResult.ok(null);
    }
    const createTaiKhoan = await TaiKhoan.create(getTaiKhoan.getValue(), CreateType.getGroups().loadFromPersistence);
    const isMatKhauValid = await this.validateMatKhau(createTaiKhoan.getValue(), matKhau);
    if (!isMatKhauValid) {
      return SuccessResult.ok(null);
    }
    return SuccessResult.ok(createTaiKhoan.getValue().serialize(CreateType.getGroups().toAppRespone));
  }

  private async validateMatKhau(taikhoan: TaiKhoan, matkhau: string) {
    if (!taikhoan) {
      return;
    } 
    return taikhoan.isMatKhauValid(matkhau);
  }
}