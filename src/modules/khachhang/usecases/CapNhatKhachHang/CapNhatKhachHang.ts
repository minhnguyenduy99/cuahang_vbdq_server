import { ICommand, FailResult, UseCaseError, SuccessResult } from "@core";
import { IKhachHangService } from "@modules/khachhang/shared";
import { Dependency, DEPConsts } from "@dep";
import CapNhatKhachHangDTO from "./CapNhatKhachHangDTO";
import { KhachHang, KhachHangDTO } from "../..";
import Errors from "./ErrorConsts";


export default class CapNhatKhachHang implements ICommand<CapNhatKhachHangDTO> {
  
  private commited: boolean;
  private data: KhachHang;
  private khachhangService: IKhachHangService;

  constructor() {
    this.khachhangService = Dependency.Instance.getDomainService(DEPConsts.KhachHangService);
  }
  
  
  isCommit(): boolean {
    return this.commited;
  }

  async commit(): Promise<KhachHangDTO> {
    await this.khachhangService.persist(this.data);
    return this.data.serialize();
  }

  getData(): KhachHang {
    return this.data;
  }

  async execute(request: CapNhatKhachHangDTO) {
    let findKhachHang = await this.khachhangService.getKhachHangById(request.id);
    if (findKhachHang.isFailure) {
      return FailResult.fail(new UseCaseError(Errors.KhachHangKhongTonTai, { id: request.id }));
    }
    let updateKhachHang = await this.khachhangService.updateKhachHang(findKhachHang.getValue(), request);
    if (updateKhachHang.isFailure) {
      return FailResult.fail(updateKhachHang.error);
    }
    this.data = updateKhachHang.getValue();
    return SuccessResult.ok(null);
  }

}
