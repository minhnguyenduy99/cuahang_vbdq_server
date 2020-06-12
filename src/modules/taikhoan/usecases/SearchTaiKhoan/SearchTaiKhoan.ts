import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { IQuery, FailResult, SuccessResult } from "@core";
import { Dependency, DEPConsts } from "@dep";
import { ITaiKhoanRepository } from "@modules/taikhoan/shared";
import STKValidate from "./STKValidate";
import SearchTaiKhoanDTO from "./SearchTaiKhoanDTO";


export default class SearchTaiKhoan implements IQuery<SearchTaiKhoanDTO> {
  
  private taikhoanRepo: ITaiKhoanRepository;

  constructor() {
    this.taikhoanRepo = Dependency.Instance.getRepository(DEPConsts.TaiKhoanRepository);
  }
  
  async execute(request: SearchTaiKhoanDTO) {
    const validateRequest = await this.validate(request);
    if (validateRequest.isFailure) {
      return FailResult.fail(validateRequest.error);
    }
    const { tenTaiKhoan ,count, from } = validateRequest.getValue();
    let [listTaiKhoan, totalCount] = await Promise.all([
      this.taikhoanRepo.searchTaiKhoan(tenTaiKhoan, from, count),
      this.taikhoanRepo.getCountSearch(tenTaiKhoan)
    ]);
    return SuccessResult.ok({
      ds_taikhoan: listTaiKhoan.map(taikhoan => {
        delete taikhoan.mat_khau
        return taikhoan
      }),
      total_count: totalCount
    });
  }

  public async validate(request: SearchTaiKhoanDTO) {
    let convertData = plainToClass(STKValidate, request); 
    let errors = await validate(convertData);
    if (errors.length > 0) {
      return FailResult.fail(errors);
    }
    return SuccessResult.ok(convertData);
  }
}