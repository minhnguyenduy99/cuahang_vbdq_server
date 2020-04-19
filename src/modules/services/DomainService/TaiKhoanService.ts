import { IDomainService, Result, IDatabaseError, FailResult, SuccessResult } from "@core";
import { TaiKhoan, ITaiKhoanRepository } from "@modules/taikhoan";
import CreateType from "@create_type";
import { EntityNotFound } from ".";


export default class TaiKhoanService implements IDomainService {
  
  constructor(
    private repo: ITaiKhoanRepository
  ) {
  }

  async findTaiKhoanById(taikhoanId: string) {
    const findTaiKhoan = await this.repo.findTaiKhoanById(taikhoanId);
    if (findTaiKhoan.isFailure) {
      return FailResult.fail(findTaiKhoan.error);
    }
    const taikhoanDTO = findTaiKhoan.getValue();
    if (!taikhoanDTO) {
      return FailResult.fail(new EntityNotFound(TaiKhoan));
    }
    const taikhoan = await TaiKhoan.create(taikhoanDTO, CreateType.getGroups().loadFromPersistence);
    return SuccessResult.ok(taikhoan.getValue());
  }

  async findTaiKhoanByTenDangNhap(tenDangNhap: string) {
    const findTaiKhoan = await this.repo.findTaiKhoan(tenDangNhap);
    if (findTaiKhoan.isFailure) {
      return FailResult.fail(findTaiKhoan.error);
    }
    const taikhoanDTO = findTaiKhoan.getValue();
    if (!taikhoanDTO) {
      return FailResult.fail(new EntityNotFound(TaiKhoan));
    }
    const taikhoan = await TaiKhoan.create(taikhoanDTO, CreateType.getGroups().loadFromPersistence);
    return SuccessResult.ok(taikhoan.getValue());
  }

  async updateAnhDaiDien(taikhoanId: string, imageUrl: string) {
    const findTaikhoan = await this.findTaiKhoanById(taikhoanId);
    if (findTaikhoan.isFailure) {
      return FailResult.fail(findTaikhoan.error);
    }
    const taikhoan = findTaikhoan.getValue();
    taikhoan.updateAnhDaiDien(imageUrl);
    await this.persist(taikhoan);
    return SuccessResult.ok(null);
  }
  
  persist(taikhoan: TaiKhoan): Promise<Result<any, IDatabaseError>> {
    return this.repo.updateTaiKhoan(taikhoan);
  }
}