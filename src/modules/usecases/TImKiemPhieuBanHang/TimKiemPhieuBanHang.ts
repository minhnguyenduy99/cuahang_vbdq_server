import { IQuery, Result, FailResult, UseCaseError, SuccessResult } from "@core";
import { IPhieuRepository } from "@modules/phieu";

export interface TimKiemPhieuBHDTO {
  id?: string;
  from?: number;
  count: number;
  date: Date;
}


export class TimKiemPhieuBanHang implements IQuery<TimKiemPhieuBHDTO> {
  

  constructor(
    private phieuBanHangRepo: IPhieuRepository<any>,
  ) {

  }
  
  async validate(request: TimKiemPhieuBHDTO): Promise<Result<void, UseCaseError<any>>> {
    if (request.count <= 0 || request.from <= 0) {
      return FailResult.fail(new UseCaseError("TimKiemPhieuBanHang"));
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
    return this.phieuBanHangRepo.findPhieuByDate(request.date, { from: request.from, count: request.count });
  }

  private async findPhieuById(phieuId: string) {
    const findPhieu = await this.phieuBanHangRepo.findPhieuById(phieuId);
    if (findPhieu.isFailure) {
      return FailResult.fail(findPhieu.error);
    }
    const phieu = findPhieu.getValue();
    if (!phieu) {
      return FailResult.fail(new UseCaseError("TimKiemPhieuBanHang", "Không tìm thấy Id phiếu"));
    }
    return SuccessResult.ok(phieu);
  }
}