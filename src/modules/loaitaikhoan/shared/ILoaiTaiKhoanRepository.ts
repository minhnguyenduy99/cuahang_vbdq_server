import LoaiTaiKhoanDTO from "../LoaiTaiKhoanDTO";

export default interface ILoaiTaiKhoanRepository {
  
  findAllLoaiTaiKhoan(): Promise<LoaiTaiKhoanDTO[]>;

  findLTKByMa(maLTK: number): Promise<LoaiTaiKhoanDTO>;

  findLoaiTKKhachHang(): Promise<LoaiTaiKhoanDTO>;

  findLoaiTKNhanVien(): Promise<LoaiTaiKhoanDTO[]>;
}