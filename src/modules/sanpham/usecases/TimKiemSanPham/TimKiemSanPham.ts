import { plainToClass } from "class-transformer";
import { ValidationError, validate } from "class-validator";
import { IQuery, Result, FailResult, SuccessResult } from "@core";
import { Dependency, DEPConsts } from "@dep";
import { ISanPhamRepository, SanPhamDTO } from "@modules/sanpham/shared";
import { TKSPValidate, TimKiemSanPhamDTO } from "./TKSP-validate";


export class TimKiemSanPham implements IQuery<TimKiemSanPhamDTO> {
  
  private sanphamRepo: ISanPhamRepository;

  constructor() {
    this.sanphamRepo = Dependency.Instance.getRepository(DEPConsts.SanPhamRepository);
  }
  
  async execute(request: TimKiemSanPhamDTO): Promise<Result<SanPhamDTO[], ValidationError[]>> {
    const validateRequest = await this.validate(request);
    if (validateRequest.isFailure) {
      return FailResult.fail(validateRequest.error);
    }
    const { tenSP, loaiSP, count, from } = validateRequest.getValue();
    const searchSanPham = await this.sanphamRepo.searchSanPham(tenSP, loaiSP, { count, from });
    return SuccessResult.ok(searchSanPham);
  }

  public async validate(request: TimKiemSanPhamDTO): Promise<Result<TKSPValidate, ValidationError[]>> {
    let convertData = plainToClass(TKSPValidate, request); 
    let errors = await validate(convertData);
    if (errors.length > 0) {
      return FailResult.fail(errors);
    }
    return SuccessResult.ok(convertData);
  }
}