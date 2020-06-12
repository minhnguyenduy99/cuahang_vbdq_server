import LoaiTaiKhoanDTO from "../LoaiTaiKhoanDTO";
import { LoaiTaiKhoan } from "..";

export default interface ILoaiTaiKhoanRepository {

  createLoaiTaiKhoan(loaiTK: LoaiTaiKhoan | string, tenLTK?: string): Promise<void>;
  
  findAllLoaiTaiKhoan(): Promise<LoaiTaiKhoanDTO[]>;

  findLTKByMa(maLTK: string): Promise<LoaiTaiKhoanDTO>;

  findLoaiTKKhachHang(): Promise<LoaiTaiKhoanDTO>;

  findLoaiTKNhanVien(): Promise<LoaiTaiKhoanDTO[]>;
}