import { ISanPhamRepository, SanPham } from "@modules/sanpham";
import { DomainEvents, FailResult, SuccessResult } from "@core";
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

  async findSanPhamById(sanphamId: string) {
    let sanphamDTO = await this.repo.getSanPhamById(sanphamId);
    if (!sanphamDTO) {
      return FailResult.fail(new EntityNotFound(SanPham));
    }
    let sanpham = await SanPham.create(sanphamDTO, CreateType.getGroups().loadFromPersistence);
    return SuccessResult.ok(sanpham.getValue());
  }

  persist(sanpham: SanPham): Promise<void> {
    return this.repo.persist(sanpham);
  }

  async updateAnhSanPham(sanphamId: string, source: string) {
    const sanphamDTO = await this.repo.getSanPhamById(sanphamId);
    let sanpham = (await SanPham.create(sanphamDTO, CreateType.getGroups().loadFromPersistence)).getValue();
    sanpham.updateAnhDaiDien(source);
    await this.persist(sanpham);
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