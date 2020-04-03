import { Result, IDatabaseError, UniqueEntityID, IDatabaseRepository } from "@core";
import { NhanVien, NhanVienDTO } from "./NhanVien";


export default interface INhanVienRepository extends IDatabaseRepository {

  getNhanVienById(id: UniqueEntityID): Promise<Result<NhanVienDTO, IDatabaseError>>;

  createNhanVien(nhanvien: NhanVien): Promise<Result<void, IDatabaseError>>;
}