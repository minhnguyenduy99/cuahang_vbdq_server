import { NhanVien, NhanVienDTO } from "../";

export default interface INhanVienRepository {

  getNhanVienById(id: string, findDeleted?: boolean): Promise<NhanVienDTO>;

  getNhanVienByCMND(cmnd: string): Promise<NhanVienDTO>;

  findNhanVienByTaiKhoan(taikhoanId: string): Promise<NhanVienDTO>;

  createNhanVien(nhanvien: NhanVien): Promise<void>;

  deleteNhanVien(id: string): Promise<void>;

  update(nhanvien: NhanVien): Promise<void>;

  findNhanVienByLimit(from: number, count?: number): Promise<NhanVienDTO[]>;
}