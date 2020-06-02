import { FailResult, SuccessResult } from "@core";
import { Dependency, DEPConsts } from "@dep";
import { IPhieuRepository, ChiTietPhieu, Phieu } from "@modules/phieu";
import { INhanVienService } from "@modules/nhanvien/shared";
import { IPhieuService, PhieuCreateError } from ".";


export default abstract class PhieuService<P extends Phieu> implements IPhieuService<P> {

  protected nhanvienService: INhanVienService;
  protected phieuRepo: IPhieuRepository<P>;

  constructor() {
    this.nhanvienService = Dependency.Instance.getDomainService(DEPConsts.NhanVienService);
    this.setPhieuRepository();
  }

  save(phieu: P) {
    return this.phieuRepo.createPhieu(phieu);
  }

  abstract setPhieuRepository(): void;
  abstract async createPhieu<CT extends ChiTietPhieu<any>>(phieuData: any, listCTphieu: CT[])
  : Promise<SuccessResult<P> | FailResult<PhieuCreateError>>;
}