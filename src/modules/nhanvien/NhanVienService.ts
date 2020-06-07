import { FailResult, SuccessResult, EntityNotFound } from "@core";
import { INhanVienRepository, NhanVien } from "@modules/nhanvien";
import { CreateType } from "@modules/core";
import { Dependency, DEPConsts } from "@dep";
import { INhanVienService } from "./shared";

export default class NhanVienService implements INhanVienService {
  
  private repo: INhanVienRepository;

  constructor() {
    this.repo = Dependency.Instance.getRepository(DEPConsts.NhanVienRepository);
  }

  persist(nhanvien: NhanVien): Promise<void> {
    return this.repo.update(nhanvien);
  }

  updateNhanVien(nhanvien: NhanVien, updateInfo: any) {
    return nhanvien.update(updateInfo);
  }

  async getNhanVienById(nhanvienId: string) {
    const nhanvienDTO = await this.repo.getNhanVienById(nhanvienId);
    if (!nhanvienDTO) {
      return FailResult.fail(new EntityNotFound(NhanVien));
    }
    const createNhanVien = await NhanVien.create(nhanvienDTO, CreateType.getGroups().loadFromPersistence);
    return SuccessResult.ok(createNhanVien.getValue());
  }
}