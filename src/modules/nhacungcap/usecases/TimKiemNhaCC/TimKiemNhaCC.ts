import { IQuery, IRepositoryError, Result, FailResult, SuccessResult } from "@core";
import { INhaCungCapRepository, NhaCungCapDTO } from "@modules/nhacungcap";
import { ValidationError, validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { TKNCCValidate, TimKiemNhaCCDTO } from "./TKNCC-validate";
import { Dependency, DEPConsts } from "@dep";


export class TimKiemNhaCungCap implements IQuery<TimKiemNhaCCDTO> {
  
  private nhaCCRepo: INhaCungCapRepository;

  constructor() {
    this.nhaCCRepo = Dependency.Instance.getRepository(DEPConsts.NhaCungCapRepository);
  }
  
  async execute(request: TimKiemNhaCCDTO): Promise<Result<NhaCungCapDTO[], ValidationError[]>> {
    const validateRequest = await this.validate(request);
    if (validateRequest.isFailure) {
      return FailResult.fail(validateRequest.error);
    }
    const searchNhaCungCap = await this.nhaCCRepo.searchNhaCungCap(validateRequest.getValue().tenNhaCC);
    return SuccessResult.ok(searchNhaCungCap);
  }

  public async validate(request: TimKiemNhaCCDTO): Promise<Result<TKNCCValidate, ValidationError[]>> {
    let convertData = await plainToClass(TKNCCValidate, request); 
    let errors = await validate(convertData);
    if (errors.length > 0) {
      return FailResult.fail(errors);
    }
    return SuccessResult.ok(convertData);
  }
}