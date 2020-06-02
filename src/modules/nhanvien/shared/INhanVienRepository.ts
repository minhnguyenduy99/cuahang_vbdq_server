import { NhanVien, NhanVienDTO } from "../";

export default interface INhanVienRepository {

  getNhanVienById(id: string): Promise<NhanVienDTO>;

  getNhanVienByCMND(cmnd: string): Promise<NhanVienDTO>;

  createNhanVien(nhanvien: NhanVien): Promise<void>;

  deleteNhanVien(id: string): Promise<void>;
}