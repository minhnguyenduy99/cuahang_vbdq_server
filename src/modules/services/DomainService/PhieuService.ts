import { IDomainService, FailResult, SuccessResult } from "@core";
import { IPhieuRepository, ChiTietPhieu, Phieu } from "@modules/phieu";
import { NhanVienService } from "@modules/services/DomainService";
import { Dependency, DEPConsts } from "@dep";
import { IPhieuService, PhieuCreateError } from "@modules/services/Shared";


export default abstract class PhieuService<P extends Phieu> implements IPhieuService<P> {

  protected nhanvienService: NhanVienService;
  protected phieuRepo: IPhieuRepository<P>;

  constructor() {
    this.nhanvienService = Dependency.Instance.getDomainService(DEPConsts.NhanVienService);
    this.setPhieuRepository();
  }

  save(phieu: P) {
    return this.phieuRepo.createPhieu(phieu);
  }

  abstract setPhieuRepository(): void;
  abstract async createPhieu<CT extends ChiTietPhieu>(phieuData: any, listCTphieu: CT[])
  : Promise<SuccessResult<P> | FailResult<PhieuCreateError>>;
}