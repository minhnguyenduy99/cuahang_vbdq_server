import { Expose, plainToClass } from "class-transformer";
import { IsQuantity } from "@modules/helpers/custom-validator";
import { Validate, validate, ValidationError } from "class-validator";
import { IQuery, Result, FailResult, SuccessResult } from "@core";
import { Dependency, DEPConsts } from "@dep";
import { IPhieuBHRepository } from "@modules/phieubanhang/shared";
import GetPhieuBanHangDTO from "./GetPhieuBanHangDTO";


export default class GetPhieuBanHang implements IQuery<GetPhieuBanHangDTO> {
  private phieuRepo: IPhieuBHRepository;

  constructor() {
    this.phieuRepo = Dependency.Instance.getRepository(DEPConsts.PhieuBHRepository);
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
    let listPhieuBHDto = await this.phieuRepo.findAllPhieu({ from: query.from, count: query.so_luong });
    return SuccessResult.ok(listPhieuBHDto);
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