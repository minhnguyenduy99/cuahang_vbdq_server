import { ICommand, Result, IDatabaseError, FailResult, SuccessResult, DomainEvents } from "@core";
import { IPhieuBHRepository, PhieuBanHangDTO } from "@modules/phieubanhang";
import { PhieuBanHang } from "@modules/phieubanhang";
import { IKhachHangRepository } from "@modules/khachhang";
import { INhanVienRepository } from "@modules/nhanvien";
import CreateType from "@create_type";
import { ICTPhieuBHRepository } from "@modules/ctphieubanhang";
import { TaoCTPhieu, TaoCTPhieuDTO } from "./TaoCTPhieu/TaoCTPhieu";
import { ISanPhamRepository } from "@modules/sanpham";
import { SanPhamService, KhachHangService, NhanVienService, DomainService } from "@modules/services";
import { PhieuBanHangCreated } from "@modules/phieubanhang";


export interface TaoPhieuMHDTO {
  kh_id: string;
  nv_id: string;
  loai_phieu: number;
  ds_ctphieu: TaoCTPhieuDTO[];
}

export class TaoPhieuBanHang implements ICommand<TaoPhieuMHDTO> {

  private data: PhieuBanHang;
  private commited: boolean;
  private taoCTPhieuUseCase: TaoCTPhieu;
  private sanphamService: SanPhamService;
  private khachhangService: KhachHangService;
  private nhanvienService: NhanVienService;

  constructor(
    private phieuRepo: IPhieuBHRepository, 
    private khachhangRepo: IKhachHangRepository, 
    private nhanvienRepo: INhanVienRepository,
    private ctphieuRepo: ICTPhieuBHRepository,
    private sanphamRepo: ISanPhamRepository) {

    this.sanphamService = DomainService.getService(SanPhamService, this.sanphamRepo);
    this.khachhangService = KhachHangService.create(this.khachhangRepo);
    this.nhanvienService = NhanVienService.create(this.nhanvienRepo);
    this.taoCTPhieuUseCase = new TaoCTPhieu(this.ctphieuRepo, this.sanphamRepo);
    this.commited = false;

    // register domain service event
    DomainEvents.register((ev: PhieuBanHangCreated) => this.sanphamService.onPhieuBanHangCreated(ev), PhieuBanHangCreated.name);
    DomainEvents.register((ev: PhieuBanHangCreated) => this.khachhangService.onPhieuBanHangCreated(ev), PhieuBanHangCreated.name);
  }

  isCommit(): boolean {
    return this.commited;
  }

  async execute(request: TaoPhieuMHDTO): Promise<Result<void, any>> {
    const [getKhachHang, getNhanVien] = await Promise.all([
      this.khachhangService.getKhachHangById(request.kh_id),
      this.nhanvienService.getNhanVienById(request.nv_id)]
    );
    const executeTaoCTPhieuUsecase = await this.taoCTPhieuUseCase.execute(request.ds_ctphieu);
    const validateResult = Result.combine([getKhachHang, getNhanVien, executeTaoCTPhieuUsecase]);
    if (validateResult.isFailure) {
      return FailResult.fail(validateResult.error);
    }

    const phieuEntity = await PhieuBanHang.create(
      request, 
      this.taoCTPhieuUseCase.getData(), 
      getKhachHang.getValue(), getNhanVien.getValue(), 
      CreateType.getGroups().createNew);

    if (phieuEntity.isFailure) {
      return FailResult.fail(phieuEntity.error);
    }
    this.data = phieuEntity.getValue();
    return SuccessResult.ok(null);
  }

  async commit(): Promise<Result<PhieuBanHangDTO, IDatabaseError>> {
    const commitPhieu = await this.phieuRepo.createPhieu(this.data);
    if (commitPhieu.isFailure) {
      return FailResult.fail(commitPhieu.error);
    }
    const commitCTPhieu = await this.taoCTPhieuUseCase.commit();
    if (commitCTPhieu.isFailure) {
      this.rollback();
      return FailResult.fail(commitCTPhieu.error);
    }
    this.commited = true;

    // dispatch event
    DomainEvents.dispatchEventsForAggregate(this.data.entityId);
    
    return SuccessResult.ok(this.data.serialize());
  }

  private rollback(): Promise<void> {
    this.phieuRepo.removePhieu(this.data.phieuId);
    return;
  }

  getData(): PhieuBanHang {
    return this.data;
  }
}
