import { FailResult, ICommand, SuccessResult, UseCaseError } from "@core";
import { INhaCungCapRepository, NhaCungCap, NhaCungCapDTO } from "@modules/nhacungcap";
import CreateType from "@create_type";
import { Dependency, DEPConsts } from "@dep";
import Errors from "./ErrorConsts";
export interface TaoNhaCungCapDTO {
  ten: string;
  dia_chi: string;
  anh_dai_dien?: string;
}

export class TaoNhaCungCap implements ICommand<TaoNhaCungCapDTO> {
  
  private repo: INhaCungCapRepository;
  private data: NhaCungCap;
  private commited: boolean;

  constructor() {
    this.repo = Dependency.Instance.getRepository(DEPConsts.NhaCungCapRepository);
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
    // Nhà cung cấp đã tồn tại
    if (nhaCungCapExists) {
      return FailResult.fail(new UseCaseError(Errors.NhaCungCapTonTai));
    }
    this.data = newNhaCC;
    return SuccessResult.ok(null);
  }

  async commit(): Promise<NhaCungCapDTO> {
    await this.repo.createNhaCungCap(this.data);
    this.commited = true;
    return this.data.serialize(CreateType.getGroups().toAppRespone);
  }

  rollback(): Promise<void> {
    return ;
  }
}