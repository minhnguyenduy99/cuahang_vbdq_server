import { IDomainService, Result, IDatabaseError } from "@core";
import { INhanVienRepository, NhanVien, NhanVienCreated } from "@modules/nhanvien";
import CreateType from "@create_type";



export default class NhanVienService implements IDomainService {
  
  private constructor(
    private repo: INhanVienRepository
  ) {
    
  }

  persist(): Promise<Result<any, IDatabaseError>> {
    throw new Error("Method not implemented.");
  }

  onNhanVienCreated(event: NhanVienCreated) { 

  }

  async getNhanVienById(nhanvienId: string) {
    const getNhanVienDTO = await this.repo.getNhanVienById(nhanvienId);
    return NhanVien.create(getNhanVienDTO.getValue(), CreateType.getGroups().loadFromPersistence);
  }

  static create(repo: INhanVienRepository) {
    return new NhanVienService(repo);
  }
}