import { ICommand, FailResult, UseCaseError, SuccessResult } from "@core";
import { INhanVienRepository } from "@modules/nhanvien/shared";
import { Dependency, DEPConsts } from "@dep";
import Errors from "./ErrorConsts";


export default class DeleteNhanVien implements ICommand<string> {
  
  private commited: boolean;
  private data: string;
  private nhanvienRepo: INhanVienRepository;

  constructor() {
    this.nhanvienRepo = Dependency.Instance.getRepository(DEPConsts.NhanVienRepository);
  }
  
  isCommit(): boolean {
    return this.commited;
  }

  async commit(): Promise<{ id: string }> {
    await this.nhanvienRepo.deleteNhanVien(this.data);
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
    this.data = nhanvien.id;
    return SuccessResult.ok(null);
  }
}
