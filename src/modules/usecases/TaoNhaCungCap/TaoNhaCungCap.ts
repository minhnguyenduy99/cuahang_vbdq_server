import { IUseCase, FailResult, ICommand, Result, IDatabaseError, SuccessResult } from "@core";
import { INhaCungCapRepository, NhaCungCap, NhaCungCapDTO } from "@modules/nhacungcap";
import NhaCungCapExistsError from "./NhaCungCapExistsError";
import CreateType from "../../entity-create-type";

export interface TaoNhaCungCapDTO {
  ten: string;
  dia_chi: string;
  anh_dai_dien?: string;
}

export class TaoNhaCungCap implements ICommand<TaoNhaCungCapDTO> {
  
  private repo: INhaCungCapRepository;
  private data: NhaCungCap;
  private commited: boolean;

  constructor(repo: INhaCungCapRepository) {
    this.repo = repo;
    this.commited = false;
  }

  isCommit(): boolean {
    return this.commited;
  }

  getData() {
    return this.data;
  }
  
  async execute(request: TaoNhaCungCapDTO) {
    const createNhaCC = await NhaCungCap.create(request as NhaCungCapDTO, CreateType.getGroups().createNew);

    // Dữ liệu từ request không hợp lệ
    if (createNhaCC.isFailure) {
      return FailResult.fail(createNhaCC.error);
    }
    const newNhaCC = createNhaCC.getValue();
    const nhaCungCapExists = await this.repo.nhaCungCapExists(newNhaCC.ten);
    if (nhaCungCapExists.isFailure) {
      return FailResult.fail(nhaCungCapExists.error);
    }
    // Nhà cung cấp đã tồn tại
    if (nhaCungCapExists.getValue()) {
      return FailResult.fail(new NhaCungCapExistsError())
    }
    this.data = newNhaCC;
    return SuccessResult.ok(null);
  }

  async commit(): Promise<Result<NhaCungCapDTO, IDatabaseError>> {
    const commitResult = await this.repo.createNhaCungCap(this.data);
    if (commitResult.isFailure) {
      return FailResult.fail(commitResult.error);
    }
    this.commited = true;
    return SuccessResult.ok(this.data.serialize());
  }

  rollback(): Promise<void> {
    return ;
  }
}