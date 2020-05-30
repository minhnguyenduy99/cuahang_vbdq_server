import { FailResult, SuccessResult, ICommand, UseCaseError } from "@core";
import { TaiKhoan, TaiKhoanDTO, ITaiKhoanRepository } from "@modules/taikhoan";
import CreateType from "@create_type";
import { Dependency, DEPConsts } from "@dep";
import Errors from "./ErrorConsts";
export interface CreateTaiKhoanDTO {
  
  ten_tk: string;
  mat_khau: string;
  anh_dai_dien: string;
  loai_tk: number;
}

export class CreateTaiKhoan implements ICommand<CreateTaiKhoanDTO> {

  private repo: ITaiKhoanRepository;
  private data: TaiKhoan;
  private commited: boolean;

  constructor() {
    this.repo = Dependency.Instance.getRepository(DEPConsts.TaiKhoanRepository); 
    this.commited = false;
  }

  isCommit() {
    return this.commited;
  }

  getData() {
    return this.data;
  }
  
  async execute(request: CreateTaiKhoanDTO) {
    const result = await TaiKhoan.create(request, CreateType.getGroups().createNew);
    if (result.isFailure) {
      return FailResult.fail(result.error);
    }
    const taikhoan = result.getValue();
    const isTaiKhoanExists = await this.repo.taiKhoanExists(taikhoan.tenTaiKhoan);
    if (isTaiKhoanExists) {
      return FailResult.fail(new UseCaseError(Errors.TaiKhoanExists));
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