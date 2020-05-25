import { IKhachHangRepository, KhachHang } from "@modules/khachhang";
import { PhieuCreated } from "@modules/phieu";
import CreateType from "@create_type";
import { Result, IRepositoryError, FailResult, UnknownAppError, SuccessResult, DomainEvents } from "@core";
import EntityNotFound from "./EntityNotFound";
import { PhieuBanHang } from "@modules/phieu/phieubanhang";
import { IKhachHangService } from "@modules/services/Shared";
import { Dependency, DEPConsts } from "@dep";


export default class KhachHangService implements IKhachHangService {
  
  private khachhangRepo: IKhachHangRepository;

  constructor() {
    this.khachhangRepo = Dependency.Instance.getRepository(DEPConsts.KhachHangRepository);
    DomainEvents.register(this.onPhieuBanHangCreated.bind(this), PhieuCreated.name);
  }

  persist(khachhang: KhachHang): Promise<Result<void, IRepositoryError>> {
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
}