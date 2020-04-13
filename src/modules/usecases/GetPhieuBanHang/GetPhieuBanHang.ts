import { IQuery, Result, FailResult, SuccessResult, LimitResult } from "@core";
import { Expose, plainToClass } from "class-transformer";
import { IsQuantity } from "@modules/helpers/custom-validator";
import { Validate, validate, ValidationError } from "class-validator";
import { IPhieuBHRepository } from "@modules/phieu/phieubanhang";


export interface GetPhieuBanHangDTO {
  from: number;
  so_luong: number;
}

export class GetPhieuBanHang implements IQuery<GetPhieuBanHangDTO> {
  
  constructor(
    private phieuRepo: IPhieuBHRepository
  ) {

  } 

  async validate(request: GetPhieuBanHangDTO): Promise<Result<ValidatedRequest, ValidationError | ValidationError[]>> {
    const convertedRequest = plainToClass(ValidatedRequest, request);
    let errors = await validate(convertedRequest);
    if (errors.length > 0 ) {
      return FailResult.fail(errors);
    }
    return SuccessResult.ok(convertedRequest);
  }
  
  async execute(request: GetPhieuBanHangDTO): Promise<Result<any, any>> {
    const validateResult = await this.validate(request);
    if (validateResult.isFailure) {
      return FailResult.fail(validateResult.error);
    }
    const query = validateResult.getValue();
    let findListPhieu = await this.phieuRepo.findAllPhieu({ from: query.from, count: query.so_luong });
    if (findListPhieu.isFailure) {
      return FailResult.fail(findListPhieu.error);
    }
    return SuccessResult.ok(findListPhieu.getValue());
  }
}

class ValidatedRequest {

  @Expose()
  @Validate(IsQuantity)
  from: number;

  @Expose()
  @Validate(IsQuantity)
  so_luong: number;
}