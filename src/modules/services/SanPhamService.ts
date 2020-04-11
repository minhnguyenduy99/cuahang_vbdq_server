import { ISanPhamRepository, SanPham } from "@modules/sanpham";
import PhieuBanHangCreated from "../phieubanhang/PhieuBanHangCreated";
import { Result, FailResult, IDomainService, IDatabaseError, BaseAppError, SuccessResult } from "@core";
import CreateType from "@create_type";


export default class SanPhamService implements IDomainService { 

  constructor(
    private repo: ISanPhamRepository) {
  }

  persist(sanpham: SanPham): Promise<Result<void, IDatabaseError>> {
    return this.repo.persist(sanpham);
  }

  async updateAnhSanPham(sanphamId: string, source: string) {
    const sanpham = (await this.findSanPhamById(sanphamId)).getValue();
    if (!sanpham) {
      return FailResult.fail(new BaseAppError("AppDomain", "SanPhamService", "Không tìm thấy sản phẩm"));
    }
    sanpham.updateAnhDaiDien(source);
    return this.persist(sanpham);
  }

  async onPhieuBanHangCreated(event: PhieuBanHangCreated) {
    const phieu = event.phieu;
    phieu.listChiTietPhieu.forEach(ctphieu => {
      let sanpham = ctphieu.chiTietSanPham;
      sanpham.updateSoLuong(ctphieu);
      this.updateSanPham(sanpham);
    });
  }

  async findSanPhamCollection(listSanPhamId: string[]) {
    const getListSanPham = await Promise.all(listSanPhamId.map(id => this.findSanPhamById(id)));
    return Result.combineSame(getListSanPham);
  }

  async findSanPhamById(sanphamId: string) {
    const findSanPham = await this.repo.getSanPhamById(sanphamId);
    const sanphamDTO = findSanPham.getValue();
    if (!sanphamDTO) {
      return SuccessResult.ok(null as SanPham);
    }
    return SanPham.create(sanphamDTO, CreateType.getGroups().loadFromPersistence);
  }

  private updateSanPham(sanpham: SanPham) {
    return this.repo.persist(sanpham);    
  }
}