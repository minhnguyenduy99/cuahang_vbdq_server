import { ICommand, FailResult, UseCaseError, SuccessResult, BaseAppError } from "@core";
import { INhanVienRepository } from "@modules/nhanvien/shared";
import { Dependency, DEPConsts } from "@dep";
import Errors from "./ErrorConsts";
import { DeleteTaiKhoan } from "@modules/taikhoan/usecases/DeleteTaiKhoan";


export default class DeleteNhanVien implements ICommand<string> {
  
  private commited: boolean;
  private data: string;
  private nhanvienRepo: INhanVienRepository;
  private deleteTaiKhoan: DeleteTaiKhoan;

  constructor() {
    this.nhanvienRepo = Dependency.Instance.getRepository(DEPConsts.NhanVienRepository);
    this.deleteTaiKhoan = new DeleteTaiKhoan();
  }
  
  isCommit(): boolean {
    return this.commited;
  }

  async commit(): Promise<{ id: string }> {
    await Promise.all([
      this.nhanvienRepo.deleteNhanVien(this.data),
      this.deleteTaiKhoan.commit()
    ]);
    return {
      id: this.data
    };
  }

  getData(): string {
    return this.data;
  }

  async execute(nhanvienId: string) {
    let nhanvien = await this.nhanvienRepo.getNhanVienById(nhanvienId);
    if (!nhanvien) {
      return FailResult.fail(new UseCaseError(Errors.NhanVienKhongTonTai, { id: nhanvienId }));
    }
    let deleteTKResult = await this.deleteTaiKhoan.execute(nhanvien.tk_id);
    if (deleteTKResult.isFailure) {
      throw new BaseAppError("DeleteNhanVien", "NhanVien", "Internal application error");
    }
    this.data = nhanvien.id;
    return SuccessResult.ok(null);
  }
}
