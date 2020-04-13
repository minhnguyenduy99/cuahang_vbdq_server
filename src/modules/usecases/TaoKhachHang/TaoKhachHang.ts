import { ICommand, Result, IDatabaseError, FailResult, SuccessResult } from "@core";
import { IKhachHangRepository, KhachHang, KhachHangDTO } from "@modules/khachhang";
import CreateType from "../../entity-create-type";
import KhachHangExists from "./KhachHangExists";

export interface TaoKhachHangDTO {
  ten_kh: string;
  cmnd: string;
}

export class TaoKhachHang implements ICommand<TaoKhachHangDTO> {
  
  private repo: IKhachHangRepository;
  private commited: boolean;
  private data: KhachHang;

  constructor(repo: IKhachHangRepository) {
    this.repo = repo;
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
    const findKhachHang = await this.repo.searchKhachHang("", request.cmnd);
    if (findKhachHang.isFailure) {
      return FailResult.fail(findKhachHang.error);
    }
    // Khách hàng với cmnd yêu cầu đã tồn tại
    if (findKhachHang.getValue().length > 0) {
      return FailResult.fail(new KhachHangExists(request.cmnd));
    }
    const createKhachHangModel = await KhachHang.create(request, CreateType.getGroups().createNew);
    if (createKhachHangModel.isFailure) {
      return FailResult.fail(createKhachHangModel.error);
    }
    this.data = createKhachHangModel.getValue();
    return SuccessResult.ok(null);
  }
  
  async commit(): Promise<Result<KhachHangDTO, IDatabaseError>> {
    const commitResult = await this.repo.createKhachHang(this.data);
    if (commitResult.isFailure) {
      return FailResult.fail(commitResult.error);
    }
    this.commited = true;
    return SuccessResult.ok(this.getData().serialize(CreateType.getGroups().toAppRespone));
  }
}