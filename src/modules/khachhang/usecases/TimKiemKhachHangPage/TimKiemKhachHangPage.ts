
import { IQuery, FailResult, SuccessResult, UseCaseError } from "@core";
import { Dependency, DEPConsts } from "@dep";
import { IKhachHangRepository } from "@modules/khachhang/shared";
import { TimKiemKhachHangPageDTO, validateResult } from "./TimKiemKhachHangPageDTO";
import Errors from "./ErrorConsts";


export default class TimKiemKhachHangPage implements IQuery<TimKiemKhachHangPageDTO> {
  
  private khachhangRepo: IKhachHangRepository;

  constructor() {
    this.khachhangRepo = Dependency.Instance.getRepository(DEPConsts.KhachHangRepository);
  }
  
  async execute(request: TimKiemKhachHangPageDTO) {
    const validateRequest = await this.validate(request);
    if (validateRequest.isFailure) {
      return FailResult.fail(new UseCaseError(Errors.RequestInvalid))
    }
    let req = validateRequest.getValue();
    const searchKhachHangPage = await this.khachhangRepo.searchKhachHangLimit(req.from, req.count);
    return SuccessResult.ok(searchKhachHangPage);
  }

  async validate(request: TimKiemKhachHangPageDTO) {
    return validateResult(request);
  }
}