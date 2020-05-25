import { Result, IRepositoryError } from "@core";
import { NhanVien, NhanVienDTO } from "./NhanVien";


export default interface INhanVienRepository {

  getNhanVienById(id: string): Promise<Result<NhanVienDTO, IRepositoryError>>;

  getNhanVienByCMND(cmnd: string): Promise<Result<NhanVienDTO, IRepositoryError>>;

  createNhanVien(nhanvien: NhanVien): Promise<Result<void, IRepositoryError>>;

  deleteNhanVien(id: string): Promise<Result<void, IRepositoryError>>;
}