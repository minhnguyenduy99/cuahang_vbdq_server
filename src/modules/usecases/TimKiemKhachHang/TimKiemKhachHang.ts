import { IQuery, Result, FailResult, SuccessResult } from "@core";
import { plainToClass } from "class-transformer";
import TKKHValidate from "./TKKH-validate";
import { validate } from "class-validator";
import { IKhachHangRepository, KhachHangDTO } from "@modules/khachhang";
import { Dependency, DEPConsts } from "@dep";

export interface TimKiemKhachHangDTO {
  kh_id?: string;
  ten_kh?: string;
  cmnd?: string;
}

export class TimKiemKhachHang implements IQuery<TimKiemKhachHangDTO> {
  
  private repo: IKhachHangRepository;

  constructor() {
    this.repo = Dependency.Instance.getRepository(DEPConsts.KhachHangRepository);
  }

  async validate(request: TimKiemKhachHangDTO): Promise<Result<TKKHValidate, any[]>> {
    const convertData = plainToClass(TKKHValidate, request);
    const errors = await validate(convertData, { skipMissingProperties: true });
    if (errors.length > 0 ) {
      return FailResult.fail(errors);
    }
    return SuccessResult.ok(convertData);
  }
  
  async execute(request: TimKiemKhachHangDTO): Promise<Result<KhachHangDTO | KhachHangDTO[], any>> {
    const validateResult = await this.validate(request);
    if (validateResult.isFailure) {
      return FailResult.fail(validateResult.error);
    }
    const searchReq = validateResult.getValue();
    if (searchReq.id) {
      return this.repo.findKhachHangById(searchReq.id);
    }
    return this.repo.searchKhachHang(searchReq.ten, searchReq.cmnd);
  }
}