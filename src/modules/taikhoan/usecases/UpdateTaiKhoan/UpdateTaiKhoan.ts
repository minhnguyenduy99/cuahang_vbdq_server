import UpdateTaiKhoanDTO from "./UpdateTaiKhoanDTO";
import { ICommand, FailResult, UseCaseError, SuccessResult } from "@core";
import { TaiKhoan } from "../..";
import { ITaiKhoanService, ITaiKhoanRepository } from "../../shared";
import { Dependency, DEPConsts } from "@dep";
import Errors from "./ErrorConsts";

export default class UpdateTaiKhoan implements ICommand<UpdateTaiKhoanDTO> {
  
  private commited: boolean = false;
  private data: TaiKhoan;
  private taikhoanService: ITaiKhoanService;
  private taikhoanRepo: ITaiKhoanRepository;
  private imageFile: any;

  constructor() {
    this.taikhoanService = Dependency.Instance.getDomainService(DEPConsts.TaiKhoanService);
    this.taikhoanRepo = Dependency.Instance.getRepository(DEPConsts.TaiKhoanRepository);
  }

  
  
  isCommit(): boolean {
    return this.commited;
  }

  getData(): TaiKhoan {
    return this.data;
  }

  async execute(request: UpdateTaiKhoanDTO) {
    let [findTKById, findTKByUserName] = await Promise.all([
      this.taikhoanService.findTaiKhoanById(request.id),
      request.ten_tk ? this.taikhoanRepo.findTaiKhoan(request.ten_tk) : null
    ]);
    if (findTKByUserName && findTKByUserName.id !== request.id) {
      return FailResult.fail(new UseCaseError(Errors.TenDangNhapTonTai, { ten_tk: request.ten_tk }));
    }
    if (findTKById.isFailure) {
      return FailResult.fail(new UseCaseError(Errors.TaiKhoanNotFound, { tk_id: request.id }));
    }
    let taiKhoan = findTKById.getValue();
    let update = await this.taikhoanService.updateTaiKhoan(taiKhoan, request);
    if (update.isFailure) {
      return FailResult.fail(update.error);
    }
    this.data = update.getValue();
    return SuccessResult.ok(null);
  }

  async commit() {
    await this.taikhoanService.persist(this.data);
    return this.data.serialize();
  }
}