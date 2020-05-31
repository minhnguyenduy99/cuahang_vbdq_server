import { FailResult, SuccessResult } from "@core";
import { TaiKhoan, ITaiKhoanRepository } from "@modules/taikhoan";
import CreateType from "@create_type";
import { EntityNotFound } from ".";
import { Dependency, DEPConsts } from "@dep";
import ITaiKhoanService from "../Shared/ITaiKhoanService";

export default class TaiKhoanService implements ITaiKhoanService {
  
  private repo: ITaiKhoanRepository;

  constructor() {
    this.repo = Dependency.Instance.getRepository(DEPConsts.TaiKhoanRepository);  
  }

  async findTaiKhoanById(taikhoanId: string) {
    const taikhoanDTO = await this.repo.findTaiKhoanById(taikhoanId);
    if (!taikhoanDTO) {
      return FailResult.fail(new EntityNotFound(TaiKhoan));
    }
    const taikhoan = await TaiKhoan.create(taikhoanDTO, CreateType.getGroups().loadFromPersistence);
    return SuccessResult.ok(taikhoan.getValue());
  }

  async findTaiKhoanByTenDangNhap(tenDangNhap: string) {
    const taikhoanDTO = await this.repo.findTaiKhoan(tenDangNhap);
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
  
  persist(taikhoan: TaiKhoan): Promise<any> {
    return this.repo.updateTaiKhoan(taikhoan);
  }
}