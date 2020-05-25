import { 
  FailResult, 
  UnknownAppError, 
  SuccessResult } from "@core";
import { INhanVienRepository, NhanVien } from "@modules/nhanvien";
import CreateType from "@create_type";
import EntityNotFound from "./EntityNotFound";
import { Dependency, DEPConsts } from "@dep";
import { INhanVienService } from "@modules/services/Shared";

export default class NhanVienService implements INhanVienService {
  
  private repo: INhanVienRepository;

  constructor() {
    this.repo = Dependency.Instance.getRepository(DEPConsts.NhanVienRepository);
  }

  async getNhanVienById(nhanvienId: string) {
    const getNhanVienDTO = await this.repo.getNhanVienById(nhanvienId);
    let nhanvienDTO = getNhanVienDTO.getValue();
    if (getNhanVienDTO.isFailure) {
      return FailResult.fail(getNhanVienDTO.error);
    }
    if (!nhanvienDTO) {
      return FailResult.fail(new EntityNotFound(NhanVien));
    }
    const createNhanVien = await NhanVien.create(nhanvienDTO, CreateType.getGroups().loadFromPersistence);
    return SuccessResult.ok(createNhanVien.getValue());
  }
}