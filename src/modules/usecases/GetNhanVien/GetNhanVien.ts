import { IQuery, FailResult, SuccessResult } from "@core";
import { IsString, validate } from "class-validator";
import { Expose, plainToClass } from "class-transformer";
import INhanVienRepository from "../../nhanvien/INhanVienRepository";


export class GetNhanVienDTO {
  
  @IsString()
  @Expose({ name: "nv_id" })
  id: string;
}

export interface GetNhanVienRequest {
  nv_id: string;
}


export class GetNhanVien implements IQuery<GetNhanVienRequest> {
  
  private repo: INhanVienRepository;

  constructor(repo: INhanVienRepository) {
    this.repo = repo;
  }

  async execute(request: GetNhanVienRequest) {
    const createIdResult = await this.validate(request);
    if (createIdResult.isFailure) {
      return createIdResult;
    }
    const result = await this.repo.getNhanVienById(createIdResult.getValue().id);
    return result;
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