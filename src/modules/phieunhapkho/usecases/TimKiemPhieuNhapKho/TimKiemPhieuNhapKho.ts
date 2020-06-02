import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { IQuery, Result, FailResult, SuccessResult } from "@core";
import { Dependency, DEPConsts } from "@dep";

import { TimKiemPhieuNhapKhoDTO, ValidatedRequest} from "./TimKiemPhieuNhapKhoDTO";
import { IPhieuNhapKhoRepository } from "../..";


export default class TimKiemPhieuNhapKho implements IQuery<TimKiemPhieuNhapKhoDTO> {
  private phieuRepo: IPhieuNhapKhoRepository;

  constructor() {
    this.phieuRepo = Dependency.Instance.getRepository(DEPConsts.PhieuNhapKhoRepository);
  }

  async validate(request: TimKiemPhieuNhapKhoDTO): Promise<Result<ValidatedRequest, ValidationError | ValidationError[]>> {
    const convertedRequest = plainToClass(ValidatedRequest, request);
    let errors = await validate(convertedRequest);
    if (errors.length > 0 ) {
      return FailResult.fail(errors);
    }
    return SuccessResult.ok(convertedRequest);
  }
  
  async execute(request: TimKiemPhieuNhapKhoDTO): Promise<Result<any, any>> {
    const validateResult = await this.validate(request);
    if (validateResult.isFailure) {
      return FailResult.fail(validateResult.error);
    }
    const query = validateResult.getValue();
    let listPhieuBHDto = await this.phieuRepo.findAllPhieu({ from: query.from, count: query.so_luong });
    return SuccessResult.ok(listPhieuBHDto);
  }
}

