import { IQuery, FailResult, UseCaseError, SuccessResult } from "@core";
import { ITaiKhoanRepository, ITaiKhoanService } from "../../shared";
import { Dependency, DEPConsts } from "@dep";
import { CreateType } from "@modules/core";

export default class GetTaiKhoanById implements IQuery<string> {
  
  private taikhoanService: ITaiKhoanService;

  constructor() {
    this.taikhoanService = Dependency.Instance.getDomainService(DEPConsts.TaiKhoanService);
  }

  async validate(taikhoanId: string) {
    return SuccessResult.ok(null);
  }
  
  async execute(taikhoanId: string) {
    let findTaiKhoan = await this.taikhoanService.findTaiKhoanById(taikhoanId);
    if (findTaiKhoan.isFailure) {
      return FailResult.fail(new UseCaseError({
        code: "GTKBIE001",
        message: "Không tìm thấy tài khoản"
      }, { tk_id: taikhoanId }));
    }
    return SuccessResult.ok(findTaiKhoan.getValue().serialize(CreateType.getGroups().exposeAll));
  }
}