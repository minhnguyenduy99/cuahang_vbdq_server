import { IKhachHangRepository } from "@modules/khachhang/shared";
import { PhieuCreated } from "@modules/phieu";
import { CreateType } from "@modules/core";
import { FailResult, UnknownAppError, SuccessResult, DomainEvents, EntityNotFound } from "@core";
import { PhieuBanHang } from "@modules/phieubanhang";
import { IKhachHangService } from "./shared";
import { Dependency, DEPConsts } from "@dep";
import { KhachHang } from ".";


export default class KhachHangService implements IKhachHangService {
  
  private khachhangRepo: IKhachHangRepository;

  constructor() {
    this.khachhangRepo = Dependency.Instance.getRepository(DEPConsts.KhachHangRepository);
    DomainEvents.register(this.onPhieuBanHangCreated.bind(this), PhieuCreated.name);
  }

  persist(khachhang: KhachHang): Promise<void> {
    return this.khachhangRepo.update(khachhang);
  }

  async getKhachHangById(khachHangId: string) {
    const khachhangDTO = await this.khachhangRepo.findKhachHangById(khachHangId);
    if (!khachhangDTO) {
      return FailResult.fail(new EntityNotFound(KhachHang));
    }
    const createKhachHang = await KhachHang.create(khachhangDTO, CreateType.getGroups().loadFromPersistence);
    if (createKhachHang.isFailure) {
      throw new UnknownAppError()
    }
    return SuccessResult.ok(createKhachHang.getValue());
  }
  
  private onPhieuBanHangCreated(event: PhieuCreated<PhieuBanHang>) {
    let phieu = event.phieu;
    let khachHang = phieu.khachHang;
    khachHang.updateTongGiaTriBan(phieu);
    this.persist(khachHang);
  }
}