import { IKhachHangRepository, KhachHang } from "@modules/khachhang";
import { PhieuCreated } from "@modules/phieu";
import CreateType from "@create_type";
import { IDomainService, Result, IDatabaseError, FailResult, UnknownAppError, SuccessResult, DomainEvents } from "@core";
import EntityNotFound from "./EntityNotFound";
import { PhieuBanHang } from "@modules/phieu/phieubanhang";


export default class KhachHangService implements IDomainService {

  constructor(
    private khachhangRepo: IKhachHangRepository
  ) {
    
    DomainEvents.register((ev: PhieuCreated<PhieuBanHang>) => this.onPhieuBanHangCreated(ev), PhieuCreated.name);
  }

  persist(khachhang: KhachHang): Promise<Result<void, IDatabaseError>> {
    return this.khachhangRepo.update(khachhang);
  }

  async getKhachHangById(khachHangId: string) {
    const findKhachHang = await this.khachhangRepo.findKhachHangById(khachHangId);
    let khachhangDTO = findKhachHang.getValue();
    if (findKhachHang.isFailure) {
      return FailResult.fail(findKhachHang.error);
    }
    if (!khachhangDTO) {
      return FailResult.fail(new EntityNotFound(KhachHang));
    }
    const createKhachHang = await KhachHang.create(khachhangDTO, CreateType.getGroups().loadFromPersistence);
    if (createKhachHang.isFailure) {
      return FailResult.fail(new UnknownAppError());
    }
    return SuccessResult.ok(createKhachHang.getValue());
  }
  
  private onPhieuBanHangCreated(event: PhieuCreated<PhieuBanHang>) {
    let phieu = event.phieu;
    let khachHang = phieu.khachHang;
    khachHang.updateTongGiaTriBan(phieu);
    this.persist(khachHang);
  }

  static create(repo: IKhachHangRepository) {
    return new KhachHangService(repo);
  }
}