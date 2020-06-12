import { ICommand, FailResult, UseCaseError, SuccessResult, DomainEvents } from "@core";
import { ITaiKhoanService, ITaiKhoanRepository } from "../../shared";
import { Dependency, DEPConsts } from "@dep";
import TaiKhoan from "../../TaiKhoan";


export default class DeleteTaiKhoan implements ICommand<string> {
  
  private commited: boolean = false;
  private data: TaiKhoan;
  private taikhoanService: ITaiKhoanService;
  private taikhoanRepo: ITaiKhoanRepository;

  constructor() {
    this.taikhoanService = Dependency.Instance.getDomainService(DEPConsts.TaiKhoanService);
    this.taikhoanRepo = Dependency.Instance.getRepository(DEPConsts.TaiKhoanRepository);
  }
  
  isCommit(): boolean {
    return this.commited;
  }

  async commit(): Promise<any> {
    await this.taikhoanRepo.deleteTaiKhoan(this.data.id);
    DomainEvents.dispatchEventsForAggregate(this.data.entityId);
    return {
      id: this.data
    }
  }

  getData() {
    return this.data;
  }

  async execute(taikhoanId: string) {
    let findTaiKhoan = await this.taikhoanService.findTaiKhoanById(taikhoanId);
    if (findTaiKhoan.isFailure) {
      return FailResult.fail(new UseCaseError({
        code: "DTKE001",
        message: "Không tìm thấy Id tài khoản"
      }))
    }
    this.data = findTaiKhoan.getValue();
    return SuccessResult.ok(null);
  }
}