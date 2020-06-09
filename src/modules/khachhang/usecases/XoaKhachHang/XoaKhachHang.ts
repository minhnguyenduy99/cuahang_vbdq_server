import { ICommand, FailResult, UseCaseError, SuccessResult } from "@core";
import { IKhachHangRepository } from "@modules/khachhang/shared";
import { Dependency, DEPConsts } from "@dep";
import Errors from "./ErrorConsts";
import { KhachHangDTO } from "../..";
import { DeleteTaiKhoan } from "@modules/taikhoan/usecases/DeleteTaiKhoan";


export default class XoaKhachHang implements ICommand<string> {
  
  private commited: boolean;
  private data: KhachHangDTO;
  private khachhangRepo: IKhachHangRepository;
  private deleteTaiKhoanUseCase: DeleteTaiKhoan;
  private doesKhachHangHasTaiKhoan: boolean = true;

  constructor() {
    this.khachhangRepo = Dependency.Instance.getRepository(DEPConsts.KhachHangRepository);
    this.deleteTaiKhoanUseCase = new DeleteTaiKhoan();
  }
  
  isCommit(): boolean {
    return this.commited;
  }

  async commit(): Promise<{ id: string }> {
    await Promise.all([
      this.khachhangRepo.deleteKhachHang(this.data.id),
      this.doesKhachHangHasTaiKhoan ? this.deleteTaiKhoanUseCase.commit() : null
    ])
    return {
      id: this.data.id
    };
  }

  getData(): KhachHangDTO {
    return this.data;
  }

  async execute(khachhangId: string) {
    let khachhang = await this.khachhangRepo.findKhachHangById(khachhangId);
    if (!khachhang) {
      return FailResult.fail(new UseCaseError(Errors.KhachHangKhongTonTai, { id: khachhangId }));
    }
    let result = await this.deleteTaiKhoanUseCase.execute(khachhang.tk_id);
    if (result.isFailure) {
      this.doesKhachHangHasTaiKhoan = false;
    }
    this.data = khachhang;
    return SuccessResult.ok(null);
  }
}
