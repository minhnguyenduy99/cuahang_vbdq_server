import { IQuery, Result, FailResult, UseCaseError, SuccessResult } from "@core";
import { IPhieuRepository } from "@modules/phieu";
import { Dependency, DEPConsts } from "@dep";
import Errors from "./ErrorConsts";
import TimKiemPhieuBHDTO from "./TimKiemPhieuBHDTO";


export default class TimKiemPhieuBanHang implements IQuery<TimKiemPhieuBHDTO> {
  
  private phieuBanHangRepo: IPhieuRepository<any>;

  constructor() {
    this.phieuBanHangRepo = Dependency.Instance.getRepository(DEPConsts.PhieuBHRepository);
  }
  
  async validate(request: TimKiemPhieuBHDTO): Promise<Result<void, UseCaseError>> {
    if (request.count <= 0 || request.from <= 0) {
      return FailResult.fail(new UseCaseError(Errors.InvalidSearchIndex));
    }
    return SuccessResult.ok(null);
  }
  
  
  async execute(request: TimKiemPhieuBHDTO): Promise<Result<any, any>> {
    const validateResult = await this.validate(request);
    if (validateResult.isFailure) {
      return FailResult.fail(validateResult.error);
    }
    if (request.id) {
      return this.findPhieuById(request.id);
    }
    return SuccessResult.ok(this.phieuBanHangRepo.findPhieuByDate(
      request.date, { 
        from: request.from, 
        count: request.count }
    ));
  }

  private async findPhieuById(phieuId: string) {
    const phieuDTO = await this.phieuBanHangRepo.findPhieuById(phieuId);
    if (!phieuDTO) {
      return FailResult.fail(new UseCaseError(Errors.PhieuIdNotFound));
    }
    return SuccessResult.ok(phieuDTO);
  }
}