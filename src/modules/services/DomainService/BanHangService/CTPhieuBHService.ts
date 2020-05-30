import CTPhieuService from "../CTPhieuService";
import { FailResult, InvalidEntity, InvalidDataError } from "@core";
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
    if (sanpham.soLuong < ctphieuData.so_luong) {
      return FailResult.fail(new InvalidDataError("so_luong", CTPhieuBHService, "Số lượng không đủ"));
    }
    return ChiTietPhieu.create(ctphieuData, CreateType.getGroups().createNew, sanpham);
  }
}