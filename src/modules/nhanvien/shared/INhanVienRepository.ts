import { NhanVien, NhanVienDTO } from "../";

export default interface INhanVienRepository {

  getTongSoLuong(): Promise<number>;

  getNhanVienById(id: string, findDeleted?: boolean): Promise<NhanVienDTO>;

  getNhanVienByCMND(cmnd: string): Promise<NhanVienDTO>;

  searchNhanVien(tenNV: string, from: number, count?: number): Promise<NhanVienDTO[]>;

  getSearchCount(tenNV: string): Promise<number>;

  findNhanVienByTaiKhoan(taikhoanId: string): Promise<NhanVienDTO>;

  createNhanVien(nhanvien: NhanVien): Promise<void>;

  deleteNhanVien(id: string): Promise<void>;

  update(nhanvien: NhanVien): Promise<void>;

  findNhanVienByLimit(from: number, count?: number): Promise<NhanVienDTO[]>;
}