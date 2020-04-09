import { Result, IDatabaseError, UniqueEntityID, IDatabaseRepository } from "@core";
import { NhanVien, NhanVienDTO } from "./NhanVien";


export default interface INhanVienRepository extends IDatabaseRepository<any> {

  getNhanVienById(id: string): Promise<Result<NhanVienDTO, IDatabaseError>>;

  createNhanVien(nhanvien: NhanVien): Promise<Result<void, IDatabaseError>>;

  persist(nhanvien: NhanVien): Promise<Result<void, IDatabaseError>>;

  deleteNhanVien(id: string): Promise<Result<void, IDatabaseError>>;
}