import { IQuery, Result, FailResult, SuccessResult, UseCaseError } from "@core";
import { plainToClass } from "class-transformer";
import TKKHValidate from "./TKKH-validate";
import { validate, ValidationError } from "class-validator";
import { IKhachHangRepository, KhachHangDTO } from "@modules/khachhang";
import { Dependency, DEPConsts } from "@dep";
import Errors from "./ErrorConsts";

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

  async validate(request: TimKiemKhachHangDTO): Promise<Result<TKKHValidate, ValidationError[]>> {
    const convertData = plainToClass(TKKHValidate, request);
    const errors = await validate(convertData, { skipMissingProperties: true });
    if (errors.length > 0 ) {
      return FailResult.fail(errors);
    }
    return SuccessResult.ok(convertData);
  }
  
  async execute(request: TimKiemKhachHangDTO): Promise<Result<KhachHangDTO[] | KhachHangDTO, ValidationError[] | UseCaseError>> {
    const validateResult = await this.validate(request);
    if (validateResult.isFailure) {
      return FailResult.fail(validateResult.error);
    }
    const searchReq = validateResult.getValue();
    if (searchReq.id) {
      let khachhang = await this.repo.findKhachHangById(searchReq.id);
      return khachhang ? SuccessResult.ok(khachhang) : FailResult.fail(new UseCaseError(Errors.KhachHangNotFound))
    }
    return SuccessResult.ok(await this.repo.searchKhachHang(searchReq.ten, searchReq.cmnd));
  }
}