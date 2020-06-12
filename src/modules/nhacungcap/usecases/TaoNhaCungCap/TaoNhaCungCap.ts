import { FailResult, ICommand, SuccessResult, UseCaseError } from "@core";
import { CreateType } from "@modules/core";
import { Dependency, DEPConsts } from "@dep";
import { INhaCungCapRepository, NhaCungCap, NhaCungCapDTO } from "@modules/nhacungcap";
import Errors from "./ErrorConsts";
import { TaoNhaCungCapDTO } from ".";
import { INhaCungCapService } from "../../shared";

export default class TaoNhaCungCap implements ICommand<TaoNhaCungCapDTO> {
  
  private repo: INhaCungCapRepository;
  private nhaCCService: INhaCungCapService;
  private data: NhaCungCap;
  private commited: boolean;

  constructor() {
    this.repo = Dependency.Instance.getRepository(DEPConsts.NhaCungCapRepository);
    this.nhaCCService = Dependency.Instance.getDomainService(DEPConsts.NhaCungCapService);

    this.commited = false;
  }

  isCommit(): boolean {
    return this.commited;
  }

  getData() {
    return this.data;
  }
  
  async execute(request: TaoNhaCungCapDTO) {
    const nhaCungCapExists = await this.repo.nhaCungCapExists(request.ten);
    // Nhà cung cấp đã tồn tại
    if (nhaCungCapExists) {
      return FailResult.fail(new UseCaseError(Errors.NhaCungCapTonTai));
    }
    const createNhaCC = await NhaCungCap.create(request as NhaCungCapDTO, CreateType.getGroups().createNew);
    // Dữ liệu từ request không hợp lệ
    if (createNhaCC.isFailure) {
      return FailResult.fail(createNhaCC.error);
    }
    let updateAnhResult = await this.nhaCCService.updateAnhDaiDien(createNhaCC.getValue(), request.anh_dai_dien);
    if (updateAnhResult.isFailure) {
      return FailResult.fail(new UseCaseError(Errors.AnhDaiDienInvalid));
    }
    const newNhaCC = createNhaCC.getValue();
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