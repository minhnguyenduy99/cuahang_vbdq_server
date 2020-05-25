import { ChiTietPhieu } from "@modules/phieu";
import { FailResult, Result } from "@core";
import CreateType from "@create_type";
import { PhieuBanHang } from "@modules/phieu/phieubanhang";

import PhieuService from "../PhieuService";
import { KhachHangService } from "@modules/services/DomainService";
import { Dependency, DEPConsts } from "@dep";
import { IPhieuBHService } from "@modules/services/Shared";


export default class PhieuBHService extends PhieuService<PhieuBanHang> implements IPhieuBHService {
  
  protected khachhangService: KhachHangService;

  constructor() {
    super();
    this.khachhangService = Dependency.Instance.getDomainService(DEPConsts.KhachHangService);
  }

  setPhieuRepository(): void {
    this.phieuRepo = Dependency.Instance.getRepository(DEPConsts.PhieuBHRepository);
  }
  
  async createPhieu(phieuData: any, listCTphieu: ChiTietPhieu[]) {
    let [getKhachHang, getNhanVien] = await Promise.all([
      this.khachhangService.getKhachHangById(phieuData.kh_id),
      this.nhanvienService.getNhanVienById(phieuData.nv_id),
    ]);
    const result = Result.combine([getKhachHang, getNhanVien]);
    if (result.isFailure) {
      return FailResult.fail(result.error);
    }
    return PhieuBanHang.create(phieuData, listCTphieu, 
      getKhachHang.getValue(), getNhanVien.getValue(), CreateType.getGroups().createNew);
  }
}