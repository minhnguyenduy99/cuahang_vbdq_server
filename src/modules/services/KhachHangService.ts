import { IKhachHangRepository, KhachHang } from "../khachhang";
import PhieuBanHangCreated from "../phieubanhang/PhieuBanHangCreated";
import CreateType from "@create_type";
import { IDomainService, Result, IDatabaseError, FailResult, UnknownAppError, SuccessResult } from "@core";
import EntityNotFound from "./DomainService/EntityNotFound";


export default class KhachHangService implements IDomainService {

  private constructor(
    private khachhangRepo: IKhachHangRepository
  ) {}

  persist(khachhang: KhachHang): Promise<Result<void, IDatabaseError>> {
    throw new Error("Method not implemented.");
  }

  onPhieuBanHangCreated(event: PhieuBanHangCreated) {
    let phieu = event.phieu;
    let khachHang = phieu.khachHang;
    khachHang.updateTongGiaTriBan(phieu);
    this.khachhangRepo.persist(khachHang);
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

  static create(repo: IKhachHangRepository) {
    return new KhachHangService(repo);
  }
}