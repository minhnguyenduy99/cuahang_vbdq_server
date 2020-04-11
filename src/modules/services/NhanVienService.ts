import { IDomainService, Result, IDatabaseError, FailResult, UnknownAppError, SuccessResult } from "@core";
import { INhanVienRepository, NhanVien, NhanVienCreated } from "@modules/nhanvien";
import CreateType from "@create_type";
import EntityNotFound from "./DomainService/EntityNotFound";



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
    let nhanvienDTO = getNhanVienDTO.getValue();
    if (getNhanVienDTO.isFailure) {
      return FailResult.fail(getNhanVienDTO.error);
    }
    if (!nhanvienDTO) {
      return FailResult.fail(new EntityNotFound(NhanVien));
    }
    const createNhanVien = await NhanVien.create(nhanvienDTO, CreateType.getGroups().loadFromPersistence);
    if (createNhanVien.isFailure) {
      return FailResult.fail(new UnknownAppError());
    }
    return SuccessResult.ok(createNhanVien.getValue());
  }

  static create(repo: INhanVienRepository) {
    return new NhanVienService(repo);
  }
}