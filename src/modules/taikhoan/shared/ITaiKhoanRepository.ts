import TaiKhoan from "../TaiKhoan";
import TaiKhoanDTO from "./TaiKhoanDTO";

export default interface ITaiKhoanRepository {
  
  createTaiKhoan(taikhoan: TaiKhoan): Promise<void>;

  searchTaiKhoan(tenTaiKhoan: string, from: number, count?: number): Promise<TaiKhoanDTO[]>;

  getCountSearch(tenTaiKhoan: string): Promise<number>;

  taiKhoanExists(tenTaiKhoan: string): Promise<boolean>;

  findTaiKhoan(tenTaiKhoan: string): Promise<TaiKhoanDTO>;

  findTaiKhoanById(taikhoanId: string, findDeleted?: boolean): Promise<TaiKhoanDTO>;

  findTaiKhoanByLimit(from: number, count?: number): Promise<TaiKhoanDTO[]>;

  deleteTaiKhoan(taikhoanId: string): Promise<boolean>;

  updateTaiKhoan(taikhoan: TaiKhoan): Promise<void>;
}