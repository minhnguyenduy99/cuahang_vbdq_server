import { ValidationError } from "class-validator";
import { FailResult, SuccessResult, DomainServiceError, IRepositoryError, InvalidDataError } from "@core";
import { ICTPhieuRepository, ChiTietPhieu } from "@modules/phieu";
import { ISanPhamRepository } from "@modules/sanpham";
import { Dependency, DEPConsts } from "@dep";
import { ICTPhieuService, ISanPhamService } from "@modules/services/Shared";

export type CTPhieuCreateError = ValidationError | ValidationError[] | DomainServiceError | IRepositoryError;
export default abstract class CTPhieuService<CT extends ChiTietPhieu> implements ICTPhieuService<CT> {

  protected sanphamService: ISanPhamService;
  protected ctphieuRepo: ICTPhieuRepository<CT>;
  protected sanphamRepo: ISanPhamRepository;

  constructor() {
    this.setCTPhieuRepository();
    this.sanphamService = Dependency.Instance.getDomainService(DEPConsts.SanPhamService);
  }

  abstract setCTPhieuRepository(): void;
  abstract async createCTPhieu(ctphieuData: any)
  : Promise<SuccessResult<CT> | FailResult<CTPhieuCreateError | InvalidDataError>>;

}