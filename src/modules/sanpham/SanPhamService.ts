import { ISanPhamRepository, SanPham } from "@modules/sanpham";
import { DomainEvents, FailResult, SuccessResult, EntityNotFound } from "@core";
import { Dependency, DEPConsts } from "@dep";
import { CreateType } from "@modules/core";
import { PhieuBanHangCreated } from "@modules/phieubanhang";
import { ISanPhamService } from "./shared";
import { PhieuNhapKhoCreated } from "@modules/phieunhapkho";


export default class SanPhamService implements ISanPhamService { 
  
  private repo: ISanPhamRepository;

  constructor() {
    this.repo = Dependency.Instance.getRepository(DEPConsts.SanPhamRepository);
    
    // register event handler to Phieu's creation events
    DomainEvents.register(this.onPhieuBanHangCreated.bind(this), PhieuBanHangCreated.name);
    DomainEvents.register(this.onPhieuNhapKhoCreated.bind(this), PhieuNhapKhoCreated.name);
  }

  async findSanPhamByNhaCC(nhaccId: string): Promise<SanPham[]> {
    let listSanPhamDTOs = await this.repo.getSanPhamByIdNhaCC(nhaccId);
    let results = await Promise.all(listSanPhamDTOs.map(sanphamDTO => SanPham.create(sanphamDTO, CreateType.getGroups().loadFromPersistence)));
    return results.map(result => result.getValue());
  }

  async findSanPhamById(sanphamId: string, findDeleted?: boolean) {
    let sanphamDTO = await this.repo.getSanPhamById(sanphamId, findDeleted);
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

  async updateSanPhamInfo(sanPham: SanPham, updateInfo: any) {
    let sanphamDTO = sanPham.serialize();
    let createUpdateSanPham = await SanPham.create({
      ...sanphamDTO,
      ...updateInfo,
      idsp: undefined,
      so_luong: undefined
    }, CreateType.getGroups().createNew);
    if (createUpdateSanPham.isFailure) {
      return createUpdateSanPham;
    }
    createUpdateSanPham.getValue().updateSoLuong(sanphamDTO.so_luong);
    return createUpdateSanPham;
  }

  private async onPhieuBanHangCreated(event: PhieuBanHangCreated) {
    const phieu = event.phieu;
    phieu.listChiTietPhieu.forEach(ctphieu => {
      let sanpham = ctphieu.hangHoa as SanPham;
      sanpham.updateSoLuong(sanpham.soLuong - ctphieu.soLuong);
      this.updateSanPham(sanpham);
    });
  }

  private async onPhieuNhapKhoCreated(event: PhieuNhapKhoCreated) {
    const phieu = event.phieu;
    phieu.listChiTietPhieu.forEach(ctphieu => {
      let sanpham = ctphieu.hangHoa as SanPham;
      sanpham.updateSoLuong(sanpham.soLuong + ctphieu.soLuong);
      this.updateSanPham(sanpham);
    });
  }

  private updateSanPham(sanpham: SanPham) {
    return this.repo.persist(sanpham);    
  }
}