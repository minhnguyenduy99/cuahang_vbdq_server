import { IKhachHangRepository, KhachHang } from "../khachhang";
import PhieuBanHangCreated from "../phieubanhang/PhieuBanHangCreated";
import CreateType from "@create_type";
import { IDomainService, Result, IDatabaseError } from "@core";


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
    const khachhang = await this.khachhangRepo.findKhachHangById(khachHangId);
    return KhachHang.create(khachhang.getValue(), CreateType.getGroups().loadFromPersistence)
  }

  static create(repo: IKhachHangRepository) {
    return new KhachHangService(repo);
  }
}