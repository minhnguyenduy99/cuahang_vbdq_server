import { ICommand, Result, FailResult, SuccessResult, UseCaseError } from "@core";
import { IKhachHangRepository, KhachHang, KhachHangDTO } from "@modules/khachhang";
import { CreateType } from "@modules/core";
import { Dependency, DEPConsts } from "@dep";
import Errors from "./ErrorConsts";
import { TaoKhachHangDTO } from ".";

export default class TaoKhachHang implements ICommand<TaoKhachHangDTO> {
  
  private repo: IKhachHangRepository;
  private commited: boolean;
  private data: KhachHang;

  constructor() {
    this.repo = Dependency.Instance.getRepository(DEPConsts.KhachHangRepository);
    this.commited = false;
  }

  isCommit(): boolean {
    return this.commited;
  }
  
  rollback(): Promise<void> {
    return;
  }

  getData(): KhachHang {
    return this.data;
  }

  async execute(request: TaoKhachHangDTO): Promise<Result<void, any>> {
    const createKhachHangModel = await KhachHang.create(request, CreateType.getGroups().createNew);
    if (createKhachHangModel.isFailure) {
      return FailResult.fail(createKhachHangModel.error);
    }
    this.data = createKhachHangModel.getValue();
    return SuccessResult.ok(null);
  }
  
  async commit(): Promise<KhachHangDTO> {
    await this.repo.createKhachHang(this.data);
    this.commited = true;
    return this.getData().serialize(CreateType.getGroups().toAppRespone);
  }
}