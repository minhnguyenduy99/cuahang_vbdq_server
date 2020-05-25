import CTPhieuService from "../CTPhieuService";
import { FailResult } from "@core";
import { ChiTietPhieu, ChiTietPhieuDTO } from "@modules/phieu";
import CreateType from "@create_type";
import { Dependency, DEPConsts } from "@dep";

export default class CTPhieuBHService extends CTPhieuService<ChiTietPhieu> {

  constructor() {
    super();
  }

  setCTPhieuRepository(): void {
    this.ctphieuRepo = Dependency.Instance.getRepository(DEPConsts.CTPhieuRepository);
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