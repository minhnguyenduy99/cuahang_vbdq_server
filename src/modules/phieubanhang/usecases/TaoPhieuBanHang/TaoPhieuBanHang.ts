import { ICommand, Result, FailResult, SuccessResult, DomainEvents, UseCaseError } from "@core";
import { CreateType } from "@modules/core";
import { Dependency, DEPConsts } from "@dep";
import { IPhieuRepository } from "@modules/phieu/shared";
import { INhanVienService } from "@modules/nhanvien/shared";
import { IKhachHangService } from "@modules/khachhang/shared";
import { PhieuBanHang } from "@modules/phieubanhang";
import { TaoCTPhieu, TaoCTPhieuDTO } from "./TaoCTPhieu";
import Errors from "./ErrorConsts";

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
  private phieuRepo: IPhieuRepository<PhieuBanHang>;
  private nhanvienService: INhanVienService;
  private khachhangService: IKhachHangService;

  constructor() {
    this.phieuRepo = Dependency.Instance.getRepository(DEPConsts.PhieuBHRepository);
    this.nhanvienService = Dependency.Instance.getDomainService(DEPConsts.NhanVienService);
    this.khachhangService = Dependency.Instance.getDomainService(DEPConsts.KhachHangService);
    this.taoCTPhieuUseCase = new TaoCTPhieu();
    this.commited = false;
  }

  isCommit(): boolean {
    return this.commited;
  }

  async execute(request: TaoPhieuMHDTO): Promise<Result<void, any>> {
    if (!request.ds_ctphieu || request.ds_ctphieu.length === 0) {
      return FailResult.fail(new UseCaseError(Errors.ListCTPhieuEmpty));
    }
    let [getNhanVien, getKhachHang] = await Promise.all([
      this.findNhanVien(request.nv_id),
      this.findKhachHang(request.kh_id)
    ]);
    let findResult = Result.combine([getNhanVien, getKhachHang]);
    if (findResult.error) {
      return FailResult.fail(findResult.error);
    }
    const createListCTPhieu = await this.taoCTPhieuUseCase.execute(request.ds_ctphieu);
    if (createListCTPhieu.isFailure) {
      return FailResult.fail(createListCTPhieu.error);
    }
    let createPhieu = await PhieuBanHang.create(
      request, 
      this.taoCTPhieuUseCase.getData(), 
      getKhachHang.getValue(),
      getNhanVien.getValue(),
      CreateType.getGroups().createNew);

    if (createPhieu.isFailure) {
      return FailResult.fail(createPhieu.error);
    }
    this.data = createPhieu.getValue();
    return SuccessResult.ok(null);
  }

  async commit(): Promise<any> {
    let [, listCTPhieuDTO] = await Promise.all([
      this.phieuRepo.createPhieu(this.data),
      this.taoCTPhieuUseCase.commit()
    ]);
    this.commited = true;
    DomainEvents.dispatchEventsForAggregate(this.data.entityId);
    let phieuDTO = this.data.serialize(CreateType.getGroups().toAppRespone);
    return {
      ...phieuDTO,
      ds_ctphieu: listCTPhieuDTO 
    }
  }

  private rollback(): Promise<void> {
    this.phieuRepo.removePhieu(this.data.phieuId);
    return;
  }

  private async findNhanVien(nhanvienId: string) {
    let findNhanVien = await this.nhanvienService.getNhanVienById(nhanvienId);
    if (findNhanVien.isFailure) {
      return FailResult.fail(new UseCaseError(Errors.NhanVienKhongTonTai, { nv_id: nhanvienId }));
    }
    return SuccessResult.ok(findNhanVien.getValue());
  }

  private async findKhachHang(khachhangId: string) {
    let findKhachHang = await this.khachhangService.getKhachHangById(khachhangId);
    if (findKhachHang.isFailure) {
      return FailResult.fail(new UseCaseError(Errors.KhachHangKhongTonTai, { kh_id: khachhangId }));
    }
    return SuccessResult.ok(findKhachHang.getValue());
  }



  getData(): PhieuBanHang {
    return this.data;
  }
}
