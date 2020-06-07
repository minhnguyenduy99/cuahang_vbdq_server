import { ICommand, FailResult, UseCaseError, SuccessResult } from "@core";
import { INhanVienService } from "@modules/nhanvien/shared";
import { Dependency, DEPConsts } from "@dep";
import UpdateNhanVienDTO from "./UpdateNhanVienDTO";
import { NhanVien, NhanVienDTO } from "../..";
import Errors from "./ErrorConsts";


export default class UpdateNhanVien implements ICommand<UpdateNhanVienDTO> {
  
  private commited: boolean;
  private data: NhanVien;
  private nhanvienService: INhanVienService;

  constructor() {
    this.nhanvienService = Dependency.Instance.getDomainService(DEPConsts.NhanVienService);
  }
  
  isCommit(): boolean {
    return this.commited;
  }

  async commit(): Promise<NhanVienDTO> {
    await this.nhanvienService.persist(this.data);
    return this.data.serialize();
  }

  getData(): NhanVien {
    return this.data;
  }

  async execute(request: UpdateNhanVienDTO) {
    let findNhanVien = await this.nhanvienService.getNhanVienById(request.id);
    if (findNhanVien.isFailure) {
      return FailResult.fail(new UseCaseError(Errors.NhanVienKhongTonTai, { id: request.id }));
    }
    let updateNhanVien = await this.nhanvienService.updateNhanVien(findNhanVien.getValue(), request);
    if (updateNhanVien.isFailure) {
      return FailResult.fail(updateNhanVien.error);
    }
    this.data = updateNhanVien.getValue();
    return SuccessResult.ok(null);
  }

}
