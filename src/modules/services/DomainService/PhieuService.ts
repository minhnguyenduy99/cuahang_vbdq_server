import { IDomainService, FailResult, SuccessResult, UseCaseError } from "@core";
import { IPhieuRepository, ChiTietPhieu, Phieu } from "@modules/phieu";
import { NhanVienService, DomainService } from "@modules/services/DomainService";
import { ValidationError } from "class-validator";
import { INhanVienRepository } from "@modules/nhanvien";

export type PhieuCreateError = ValidationError | ValidationError[] | UseCaseError<any> | UseCaseError<any>[];

export default abstract class PhieuService<P extends Phieu> implements IDomainService {

  protected nhanvienService: NhanVienService;
  
  constructor(
    protected phieuRepo: IPhieuRepository<P>,
    nhanvienRepo: INhanVienRepository
  ) {
    this.nhanvienService = DomainService.getService(NhanVienService, nhanvienRepo);
  }

  save(phieu: P) {
    return this.phieuRepo.createPhieu(phieu);
  }

  abstract async createPhieu<CT extends ChiTietPhieu>(phieuData: any, listCTphieu: CT[])
  : Promise<SuccessResult<P> | FailResult<PhieuCreateError>>;
}