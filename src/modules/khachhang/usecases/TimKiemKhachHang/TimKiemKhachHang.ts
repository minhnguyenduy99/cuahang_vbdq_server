import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { IQuery, Result, FailResult, SuccessResult, UseCaseError } from "@core";
import { IKhachHangRepository, KhachHangDTO } from "@modules/khachhang";
import { Dependency, DEPConsts } from "@dep";
import Errors from "./ErrorConsts";
import { TimKiemKhachHangDTO } from ".";
import TKKHValidate from "./TKKH-validate";

export default class TimKiemKhachHang implements IQuery<TimKiemKhachHangDTO> {
  
  private repo: IKhachHangRepository;

  constructor() {
    this.repo = Dependency.Instance.getRepository(DEPConsts.KhachHangRepository);
  }

  async validate(request: TimKiemKhachHangDTO): Promise<Result<TKKHValidate, ValidationError[]>> {
    const convertData = plainToClass(TKKHValidate, request);
    const errors = await validate(convertData, { skipMissingProperties: true });
    if (errors.length > 0 ) {
      return FailResult.fail(errors);
    }
    return SuccessResult.ok(convertData);
  }
  
  async execute(request: TimKiemKhachHangDTO) {
    const validateResult = await this.validate(request);
    if (validateResult.isFailure) {
      return FailResult.fail(validateResult.error);
    }
    const searchReq = validateResult.getValue();
    if (searchReq.id) {
      let khachhang = await this.repo.findKhachHangById(searchReq.id);
      return khachhang ? SuccessResult.ok(khachhang) : FailResult.fail(new UseCaseError(Errors.KhachHangNotFound))
    }
    let [listKhachHang, totalCount] = await Promise.all([
      this.repo.searchKhachHang(searchReq.ten, searchReq.cmnd, searchReq.from, searchReq.count),
      this.repo.getSoLuongSearch(searchReq.ten, searchReq.cmnd)
    ])
    return SuccessResult.ok({
      ds_khachhang: listKhachHang,
      total_count: totalCount
    });
  }
}