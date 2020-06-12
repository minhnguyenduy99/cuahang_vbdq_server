import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { IQuery, FailResult, SuccessResult } from "@core";
import { INhanVienRepository } from "@modules/nhanvien";
import { Dependency, DEPConsts } from "@dep";
import FindNhanVienDTO from "./FindNhanVienDTO";
import FNVValidate from "./FNVValidate";

export default class TimKiemNhanVien implements IQuery<FindNhanVienDTO> {
  
  private repo: INhanVienRepository;

  constructor() {
    this.repo = Dependency.Instance.getRepository(DEPConsts.NhanVienRepository);
  }

  async validate(request: FindNhanVienDTO) {
    const convertData = plainToClass(FNVValidate, request);
    const errors = await validate(convertData, { skipMissingProperties: true });
    if (errors.length > 0 ) {
      return FailResult.fail(errors);
    }
    return SuccessResult.ok(convertData);
  }
  
  async execute(request: FindNhanVienDTO) {
    const validateResult = await this.validate(request);
    if (validateResult.isFailure) {
      return FailResult.fail(validateResult.error);
    }
    const searchReq = validateResult.getValue();
    let [listNhanVien, totalCount] = await Promise.all([
      this.repo.searchNhanVien(searchReq.ten, searchReq.from, searchReq.count),
      this.repo.getSearchCount(searchReq.ten)
    ])
    return SuccessResult.ok({
      ds_nhanvien: listNhanVien,
      total_count: totalCount
    });
  }
}