import { ISanPhamRepository, SanPham } from "@modules/sanpham";
import { Result, FailResult, IRepositoryError, BaseAppError, DomainEvents } from "@core";
import CreateType from "@create_type";
import { PhieuCreated } from "@modules/phieu";
import { PhieuBanHang } from "@modules/phieu/phieubanhang";
import { EntityNotFound } from "@modules/services/DomainService";
import { ISanPhamService } from "@modules/services/Shared";
import { Dependency, DEPConsts } from "@dep";


export default class SanPhamService implements ISanPhamService { 
  
  private repo: ISanPhamRepository;

  constructor() {
    this.repo = Dependency.Instance.getRepository(DEPConsts.SanPhamRepository);
    DomainEvents.register(this.onPhieuBanHangCreated.bind(this), PhieuCreated.name);
  }

  persist(sanpham: SanPham): Promise<Result<void, IRepositoryError>> {
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

  private async onPhieuBanHangCreated(event: PhieuCreated<PhieuBanHang>) {
    const phieu = event.phieu;
    phieu.listChiTietPhieu.forEach(ctphieu => {
      let sanpham = ctphieu.chiTietSanPham;
      sanpham.updateSoLuong(ctphieu);
      this.updateSanPham(sanpham);
    });
  }

  private updateSanPham(sanpham: SanPham) {
    return this.repo.persist(sanpham);    
  }
}