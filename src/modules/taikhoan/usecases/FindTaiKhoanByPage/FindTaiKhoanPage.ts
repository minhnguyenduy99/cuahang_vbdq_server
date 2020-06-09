
import { IQuery, FailResult, SuccessResult, UseCaseError } from "@core";
import { Dependency, DEPConsts } from "@dep";
import { ITaiKhoanRepository } from "@modules/taikhoan/shared";
import { FindTaiKhoanPageDTO, validateResult } from "./FindTaiKhoanPageDTO";
import Errors from "./ErrorConsts";


export default class FindTaiKhoanPage implements IQuery<FindTaiKhoanPageDTO> {
  
  private taikhoanRepo: ITaiKhoanRepository;

  constructor() {
    this.taikhoanRepo = Dependency.Instance.getRepository(DEPConsts.TaiKhoanRepository);
  }
  
  async execute(request: FindTaiKhoanPageDTO) {
    const validateRequest = await this.validate(request);
    if (validateRequest.isFailure) {
      return FailResult.fail(new UseCaseError(Errors.RequestKhongHopLe))
    }
    let req = validateRequest.getValue();
    const searchTaiKhoanPage = await this.taikhoanRepo.findTaiKhoanByLimit(req.from, req.count);
    return SuccessResult.ok(searchTaiKhoanPage.map(taikhoan => {
      delete taikhoan.mat_khau;
      return taikhoan;
    }));
  }

  async validate(request: FindTaiKhoanPageDTO) {
    return validateResult(request);
  }
}