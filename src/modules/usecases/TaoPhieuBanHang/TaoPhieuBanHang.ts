import { ICommand, Result, IDatabaseError, FailResult, SuccessResult, DomainEvents } from "@core";
import { IKhachHangRepository } from "@modules/khachhang";
import { INhanVienRepository } from "@modules/nhanvien";
import CreateType from "@create_type";
import { TaoCTPhieu, TaoCTPhieuDTO } from "./TaoCTPhieu/TaoCTPhieu";
import { ISanPhamRepository } from "@modules/sanpham";
import { SanPhamService, KhachHangService, NhanVienService, DomainService, PhieuBHService } from "@modules/services/DomainService";
import { IPhieuRepository, ICTPhieuRepository, PhieuCreated, ChiTietPhieu } from "@modules/phieu";
import { PhieuBanHang, PhieuBanHangDTO} from "@modules/phieu/phieubanhang";

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
  private phieuService: PhieuBHService;

  constructor(
    private phieuRepo: IPhieuRepository<PhieuBanHang>, 
    khachhangRepo: IKhachHangRepository, 
    nhanvienRepo: INhanVienRepository,
    ctphieuRepo: ICTPhieuRepository<ChiTietPhieu>,
    sanphamRepo: ISanPhamRepository) {

    this.phieuService = DomainService.getService(
      PhieuBHService, this.phieuRepo, 
      DomainService.getService(NhanVienService, nhanvienRepo),
      DomainService.getService(KhachHangService, khachhangRepo));
    
    this.taoCTPhieuUseCase = new TaoCTPhieu(ctphieuRepo, sanphamRepo);
    this.commited = false;
  }

  isCommit(): boolean {
    return this.commited;
  }

  async execute(request: TaoPhieuMHDTO): Promise<Result<void, any>> {
    const createListCTPhieu = await this.taoCTPhieuUseCase.execute(request.ds_ctphieu);
    if (createListCTPhieu.isFailure) {
      return FailResult.fail(createListCTPhieu.error);
    }
    let createPhieu = await this.phieuService.createPhieu(request, this.taoCTPhieuUseCase.getData());
    if (createPhieu.isFailure) {
      return FailResult.fail(createPhieu.error);
    }
    this.data = createPhieu.getValue();
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

    DomainEvents.dispatchEventsForAggregate(this.data.entityId);
    
    return SuccessResult.ok(this.data.serialize(CreateType.getGroups().toAppRespone));
  }

  private rollback(): Promise<void> {
    this.phieuRepo.removePhieu(this.data.phieuId);
    return;
  }

  getData(): PhieuBanHang {
    return this.data;
  }
}
