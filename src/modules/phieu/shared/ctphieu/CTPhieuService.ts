import { ValidationError } from "class-validator";
import { FailResult, SuccessResult, DomainServiceError, IRepositoryError, InvalidDataError } from "@core";
import { Dependency, DEPConsts } from "@dep";
import { ICTPhieuRepository, ChiTietPhieu } from "@modules/phieu";
import { ISanPhamRepository, ISanPhamService } from "@modules/sanpham/shared";
import ICTPhieuService from "./ICTPhieuService";

export type CTPhieuCreateError = ValidationError | ValidationError[] | DomainServiceError | IRepositoryError;
export default abstract class CTPhieuService<CT extends ChiTietPhieu<any>> implements ICTPhieuService<CT> {

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