import CreateType from "@create_type";
import { ValidationError } from "class-validator";

import { IDomainService, FailResult, Result, SuccessResult, DomainServiceError, IRepositoryError, DomainService } from "@core";
import { ICTPhieuRepository, ChiTietPhieu } from "@modules/phieu";
import { ISanPhamRepository } from "@modules/sanpham";

import SanPhamService from "./SanPhamService";
import { Dependency, DEPConsts } from "@dep";
import { ICTPhieuService } from "@modules/services/Shared";

export type CTPhieuCreateError = ValidationError | ValidationError[] | DomainServiceError | IRepositoryError;
export default abstract class CTPhieuService<CT extends ChiTietPhieu> implements ICTPhieuService<CT> {

  protected sanphamService: SanPhamService;
  protected ctphieuRepo: ICTPhieuRepository<CT>;
  protected sanphamRepo: ISanPhamRepository;

  constructor() {
    this.setCTPhieuRepository();
    this.sanphamService = Dependency.Instance.getDomainService(DEPConsts.SanPhamService);
  }

  abstract setCTPhieuRepository(): void;
  abstract async createCTPhieu(ctphieuData: any)
  : Promise<SuccessResult<CT> | FailResult<CTPhieuCreateError>>;

}