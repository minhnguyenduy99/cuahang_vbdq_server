import CTPhieuService from "../CTPhieuService";
import { FailResult, Result, DomainEvents } from "@core";
import { ChiTietPhieu, ChiTietPhieuDTO, ICTPhieuRepository } from "@modules/phieu";
import CreateType from "@create_type";
import { ISanPhamRepository } from "@modules/sanpham";


export default class CTPhieuBHService extends CTPhieuService<ChiTietPhieu> {

  constructor(ctphieuRepo: ICTPhieuRepository<ChiTietPhieu>, sanphamRepo: ISanPhamRepository) {
    super(ctphieuRepo, sanphamRepo);
  }

  async createCTPhieu(ctphieuData: ChiTietPhieuDTO) {
    let getSanPham = await this.sanphamService.findSanPhamById(ctphieuData.sp_id);
    if (getSanPham.isFailure) {
      return FailResult.fail(getSanPham.error);
    }
    let sanpham = getSanPham.getValue();
    return ChiTietPhieu.create(ctphieuData, CreateType.getGroups().createNew, sanpham);
  }
}