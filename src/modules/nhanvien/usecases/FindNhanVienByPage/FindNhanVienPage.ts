
import { IQuery, FailResult, SuccessResult, UseCaseError } from "@core";
import { Dependency, DEPConsts } from "@dep";
import { INhanVienRepository } from "@modules/nhanvien/shared";
import { FindNhanVienPageDTO, validateResult } from "./FindNhanVienPageDTO";
import Errors from "./ErrorConsts";


export default class FindNhanVienPage implements IQuery<FindNhanVienPageDTO> {
  
  private nhanvienRepo: INhanVienRepository;

  constructor() {
    this.nhanvienRepo = Dependency.Instance.getRepository(DEPConsts.NhanVienRepository);
  }
  
  async execute(request: FindNhanVienPageDTO) {
    const validateRequest = await this.validate(request);
    if (validateRequest.isFailure) {
      return FailResult.fail(new UseCaseError(Errors.RequestInvalid))
    }
    let req = validateRequest.getValue();
    const searchNhanVienPage = await this.nhanvienRepo.findNhanVienByLimit(req.from, req.count);
    return SuccessResult.ok(searchNhanVienPage);
  }

  async validate(request: FindNhanVienPageDTO) {
    return validateResult(request);
  }
}