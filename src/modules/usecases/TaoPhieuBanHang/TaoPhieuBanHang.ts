import { ICommand, Result, IRepositoryError, FailResult, SuccessResult, DomainEvents } from "@core";
import CreateType from "@create_type";
import { TaoCTPhieu, TaoCTPhieuDTO } from "./TaoCTPhieu/TaoCTPhieu";
import { IPhieuRepository } from "@modules/phieu";
import { PhieuBanHang, PhieuBanHangDTO} from "@modules/phieu/phieubanhang";
import { Dependency, DEPConsts } from "@dep";
import { IPhieuBHService } from "@modules/services/Shared";

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
  private phieuService: IPhieuBHService;
  private phieuRepo: IPhieuRepository<PhieuBanHang>;

  constructor() {
    this.phieuService = Dependency.Instance.getDomainService(DEPConsts.PhieuBHService);
    this.taoCTPhieuUseCase = new TaoCTPhieu();
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

  async commit(): Promise<Result<PhieuBanHangDTO, IRepositoryError>> {
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
