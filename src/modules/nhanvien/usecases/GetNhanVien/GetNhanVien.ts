import { IQuery, FailResult, SuccessResult } from "@core";
import { IsString, validate } from "class-validator";
import { Expose, plainToClass } from "class-transformer";
import INhanVienRepository from "../../shared/INhanVienRepository";
import { Dependency, DEPConsts } from "@dep";
import { GetNhanVienRequest, GetNhanVienDTO } from "./GetNhanVienDTO";


export class GetNhanVien implements IQuery<GetNhanVienRequest> {
  
  private repo: INhanVienRepository;

  constructor() {
    this.repo = Dependency.Instance.getRepository(DEPConsts.NhanVienRepository);
  }

  async execute(request: GetNhanVienRequest) {
    const createIdResult = await this.validate(request);
    if (createIdResult.isFailure) {
      return createIdResult;
    }
    const result = await this.repo.getNhanVienById(createIdResult.getValue().id);
    return SuccessResult.ok(result);
  }

  async validate(request: GetNhanVienRequest) {
    const data = await plainToClass(GetNhanVienDTO, request);
    const errors = await validate(data);
    if (errors.length > 0) {
      return FailResult.fail(errors);
    }
    return SuccessResult.ok(data);
  }
}