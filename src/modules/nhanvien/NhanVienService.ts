import { FailResult, SuccessResult, EntityNotFound, DomainEvents } from "@core";
import { INhanVienRepository, NhanVien } from "@modules/nhanvien";
import { CreateType } from "@modules/core";
import { Dependency, DEPConsts } from "@dep";
import { INhanVienService } from "./shared";
import { TaiKhoanDeleted } from "../taikhoan";

export default class NhanVienService implements INhanVienService {
  
  private repo: INhanVienRepository;

  constructor() {
    this.repo = Dependency.Instance.getRepository(DEPConsts.NhanVienRepository);

    DomainEvents.register(this.onTaiKhoanDeleted.bind(this), TaiKhoanDeleted.name);
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

  private async onTaiKhoanDeleted(event: TaiKhoanDeleted) {
    let nhanvien = await this.repo.findNhanVienByTaiKhoan(event.taikhoan.id);
    if (!nhanvien) {
      return;
    }
    await this.repo.deleteNhanVien(nhanvien.id);
  }
}