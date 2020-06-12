import { FailResult, SuccessResult, ICommand, UseCaseError } from "@core";
import { TaiKhoan, TaiKhoanDTO, ITaiKhoanRepository } from "@modules/taikhoan";
import { CreateType } from "@modules/core";
import { Dependency, DEPConsts } from "@dep";
import Errors from "./ErrorConsts";
import CreateTaiKhoanDTO from "./CreateTaiKhoanDTO";
import { ITaiKhoanService } from "../../shared";


export default class CreateTaiKhoan implements ICommand<CreateTaiKhoanDTO> {

  private repo: ITaiKhoanRepository;
  private taikhoanService: ITaiKhoanService;
  private data: TaiKhoan;
  private commited: boolean;

  constructor() {
    this.repo = Dependency.Instance.getRepository(DEPConsts.TaiKhoanRepository); 
    this.taikhoanService = Dependency.Instance.getDomainService(DEPConsts.TaiKhoanService);
    this.commited = false;
  }

  isCommit() {
    return this.commited;
  }

  getData() {
    return this.data;
  }
  
  async execute(request: CreateTaiKhoanDTO) {
    const isTaiKhoanExists = await this.repo.taiKhoanExists(request.ten_tk);
    if (isTaiKhoanExists) {
      return FailResult.fail(new UseCaseError(Errors.TaiKhoanExists));
    }
    const result = await TaiKhoan.create(request, CreateType.getGroups().createNew);
    if (result.isFailure) {
      return FailResult.fail(result.error);
    }
    const taikhoan = result.getValue();
    let updateAnhResult = await this.taikhoanService.updateAnhDaiDien(taikhoan, request.anh_dai_dien);
    if (updateAnhResult.isFailure) {
      return FailResult.fail(new UseCaseError(Errors.AnhDaiDienInvalid));
    }
    this.data = taikhoan;
    return SuccessResult.ok(null);
  }

  async commit(): Promise<TaiKhoanDTO> {
    await this.repo.createTaiKhoan(this.data);
    this.commited = true;
    return this.data.serialize(CreateType.getGroups().toAppRespone);
  }

  rollback(): Promise<void> {
    if (!this.isCommit()) {
      return;
    }
    // do something to rollback the data
    this.repo.deleteTaiKhoan(this.data.id);
  }
}