import { ICommand, FailResult, UseCaseError, SuccessResult } from "@core";
import { IKhachHangRepository } from "@modules/khachhang/shared";
import { Dependency, DEPConsts } from "@dep";
import Errors from "./ErrorConsts";


export default class XoaKhachHang implements ICommand<string> {
  
  private commited: boolean;
  private data: string;
  private khachhangRepo: IKhachHangRepository;

  constructor() {
    this.khachhangRepo = Dependency.Instance.getRepository(DEPConsts.KhachHangRepository);
  }
  
  isCommit(): boolean {
    return this.commited;
  }

  async commit(): Promise<{ id: string }> {
    await this.khachhangRepo.deleteKhachHang(this.data);
    return {
      id: this.data
    };
  }

  getData(): string {
    return this.data;
  }

  async execute(khachhangId: string) {
    let khachhang = await this.khachhangRepo.findKhachHangById(khachhangId);
    if (!khachhang) {
      return FailResult.fail(new UseCaseError(Errors.KhachHangKhongTonTai, { id: khachhangId }));
    }
    this.data = khachhang.id;
    return SuccessResult.ok(null);
  }
}
