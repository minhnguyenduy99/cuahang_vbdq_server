import uniqid from "uniqid";
import { IUseCase, FailResult, SuccessResult, ICommand, Entity, Result, IDatabaseError } from "@core";
import { ITaiKhoanRepository } from "../..";
import { TaiKhoan, TaiKhoanDTO } from "../../TaiKhoan";
import TaiKhoanExistsError from "./TaiKhoanExistsError";
import CreateType from "../../../entity-create-type";

 
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

  constructor(repo: ITaiKhoanRepository) {
    this.repo = repo; 
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
    if (isTaiKhoanExists.isFailure) {
      return FailResult.fail(isTaiKhoanExists.error);
    }
    if (isTaiKhoanExists.getValue()) {
      return FailResult.fail(new TaiKhoanExistsError());
    }
    this.data = taikhoan;
    return SuccessResult.ok(null);
  }

  async commit(): Promise<Result<TaiKhoanDTO, IDatabaseError>> {
    const commitResult = await await this.repo.createTaiKhoan(this.data);
    if (commitResult.isSuccess) {
      this.commited = true;
      return SuccessResult.ok(this.data.serialize());
    }
    return FailResult.fail(commitResult.error);
  }

  rollback(): Promise<void> {
    if (!this.isCommit()) {
      return;
    }
    // do something to rollback the data
    this.repo.deleteTaiKhoan(this.data.id);
  }
}