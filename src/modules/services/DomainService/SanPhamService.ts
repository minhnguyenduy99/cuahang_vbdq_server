import { ISanPhamRepository, SanPham } from "@modules/sanpham";
import { Result, FailResult, IDomainService, IDatabaseError, BaseAppError, DomainEvents } from "@core";
import CreateType from "@create_type";
import { PhieuCreated } from "@modules/phieu";
import { PhieuBanHang } from "@modules/phieu/phieubanhang";
import { EntityNotFound } from "@modules/services/DomainService";


export default class SanPhamService implements IDomainService { 

  constructor(
    private repo: ISanPhamRepository) {

    DomainEvents.register((ev) => this.onPhieuBanHangCreated(ev as PhieuCreated<PhieuBanHang>), PhieuCreated.name);
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

  private async onPhieuBanHangCreated(event: PhieuCreated<PhieuBanHang>) {
    const phieu = event.phieu;
    phieu.listChiTietPhieu.forEach(ctphieu => {
      let sanpham = ctphieu.chiTietSanPham;
      sanpham.updateSoLuong(ctphieu);
      this.updateSanPham(sanpham);
    });
  }

  async findSanPhamById(sanphamId: string) {
    const findSanPham = await this.repo.getSanPhamById(sanphamId);
    if (findSanPham.isFailure) {
      return FailResult.fail(findSanPham.error);
    }
    const sanphamDTO = findSanPham.getValue();
    if (!sanphamDTO) {
      return FailResult.fail(new EntityNotFound(SanPham));
    }
    return SanPham.create(sanphamDTO, CreateType.getGroups().loadFromPersistence);
  }

  private updateSanPham(sanpham: SanPham) {
    return this.repo.persist(sanpham);    
  }
}