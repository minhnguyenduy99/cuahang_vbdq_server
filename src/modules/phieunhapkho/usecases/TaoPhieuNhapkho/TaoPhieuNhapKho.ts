import { ICommand, Result, FailResult, SuccessResult, DomainEvents, UseCaseError } from "@core";
import { CreateType } from "@modules/core";
import { Dependency, DEPConsts } from "@dep";
import { IPhieuRepository } from "@modules/phieu/shared";
import { INhanVienService } from "@modules/nhanvien/shared";
import { INhaCungCapService } from "@modules/nhacungcap/shared";
import { PhieuNhapKho } from "../..";
import TaoCTPhieuNK from "./TaoCTPhieuPhieuNK";
import Errors from "./ErrorConsts";
import TaoPhieuNhapKhoDTO from "./TaoPhieuNhapKhoDTO";


export default class TaoPhieuNhapKho implements ICommand<TaoPhieuNhapKhoDTO> {

  private data: PhieuNhapKho;
  private commited: boolean;
  private taoCTPhieuUseCase: TaoCTPhieuNK;
  private phieuRepo: IPhieuRepository<PhieuNhapKho>;
  private nhanvienService: INhanVienService;
  private nhaCungCapService: INhaCungCapService;

  constructor() {
    this.phieuRepo = Dependency.Instance.getRepository(DEPConsts.PhieuNhapKhoRepository);
    this.nhanvienService = Dependency.Instance.getDomainService(DEPConsts.NhanVienService);
    this.nhaCungCapService = Dependency.Instance.getDomainService(DEPConsts.NhaCungCapService);
    this.taoCTPhieuUseCase = new TaoCTPhieuNK();
    this.commited = false;
  }

  isCommit(): boolean {
    return this.commited;
  }

  async execute(request: TaoPhieuNhapKhoDTO): Promise<Result<void, any>> {
    if (!request.ds_ctphieu || request.ds_ctphieu.length === 0) {
      return FailResult.fail(new UseCaseError(Errors.ListCTPhieuEmpty));
    }
    let [getNhanVien, getNhaCungCap, getListCTPhieu] = await Promise.all([
      this.findNhanVien(request.nv_id),
      this.findNhaCungCap(request.nhacc_id),
      this.taoCTPhieuUseCase.execute(request.ds_ctphieu.map(ctphieu => {
        return {
          ...ctphieu,
          nhacc_id: request.nhacc_id
        }
      }))
    ]);
    let findResult = Result.combine([getNhanVien, getNhaCungCap, getListCTPhieu]);
    if (findResult.error) {
      return FailResult.fail(findResult.error);
    }
    let createPhieu = await PhieuNhapKho.create(
      request, 
      this.taoCTPhieuUseCase.getData(), 
      getNhaCungCap.getValue(),
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

  private async findNhaCungCap(nhaccId: string) {
    let findNhaCungCap = await this.nhaCungCapService.findNhaCungCapById(nhaccId);
    if (findNhaCungCap.isFailure) {
      return FailResult.fail(new UseCaseError(Errors.NhaCungCapKhongTonTai, { nhacc_id: nhaccId }));
    }
    return SuccessResult.ok(findNhaCungCap.getValue());
  }

  getData(): PhieuNhapKho {
    return this.data;
  }
}
