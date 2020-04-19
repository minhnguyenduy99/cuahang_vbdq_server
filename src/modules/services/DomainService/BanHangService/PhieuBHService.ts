import { ChiTietPhieu } from "@modules/phieu";
import { FailResult, Result, DomainService } from "@core";
import CreateType from "@create_type";
import { PhieuBanHang, IPhieuBHRepository } from "@modules/phieu/phieubanhang";
import { INhanVienRepository } from "@modules/nhanvien";
import { IKhachHangRepository } from "@modules/khachhang";

import PhieuService from "../PhieuService";
import { KhachHangService } from "@modules/services/DomainService";


export default class PhieuBHService extends PhieuService<PhieuBanHang> {
  
  protected khachhangService: KhachHangService;

  constructor(
    protected phieuRepo: IPhieuBHRepository,
    nhanvienRepo: INhanVienRepository,
    khachhangRepo: IKhachHangRepository
  ) {

    super(phieuRepo, nhanvienRepo);
    this.khachhangService = DomainService.getService(KhachHangService, khachhangRepo);
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