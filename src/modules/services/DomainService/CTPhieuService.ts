import CreateType from "@create_type";
import { ValidationError } from "class-validator";

import { IDomainService, FailResult, Result, SuccessResult, DomainServiceError, IDatabaseError, DomainService } from "@core";
import { ICTPhieuRepository, ChiTietPhieu } from "@modules/phieu";
import { ISanPhamRepository } from "@modules/sanpham";

import SanPhamService from "./SanPhamService";


export type CTPhieuCreateError = ValidationError | ValidationError[] | DomainServiceError | IDatabaseError;
export default abstract class CTPhieuService<CT extends ChiTietPhieu> implements IDomainService {

  protected sanphamService: SanPhamService;
  protected ctphieuRepo: ICTPhieuRepository<CT>;

  constructor(
    ctphieuRepo: ICTPhieuRepository<CT>,
    private sanphamRepo: ISanPhamRepository
  ) {
    this.ctphieuRepo = ctphieuRepo;
    this.sanphamService = DomainService.getService(SanPhamService, this.sanphamRepo);
  }

  async getCTPhieuWithSanPham(phieuId: string) {
    let findCTPhieu = await this.ctphieuRepo.findAllCTPhieu(phieuId);
    if (findCTPhieu.isFailure) {
      return FailResult.fail(findCTPhieu);
    }
    let listCTPhieu = findCTPhieu.getValue();
    let listCTPhieuSPMap = await Promise.all(listCTPhieu.map(async (ctphieu) => {
      const sp = await this.sanphamRepo.findById(ctphieu.sp_id);
      return {
        ...ctphieu,
        san_pham: sp.getValue()
      }
    }));
    return listCTPhieuSPMap;
  }

  abstract async createCTPhieu(ctphieuData: any)
  : Promise<SuccessResult<CT> | FailResult<CTPhieuCreateError>>;

}