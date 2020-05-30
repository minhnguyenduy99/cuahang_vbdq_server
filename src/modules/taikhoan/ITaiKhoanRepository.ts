import { Result, IRepositoryError } from "@core";
import { TaiKhoan, TaiKhoanDTO } from "./TaiKhoan";

export default interface ITaiKhoanRepository {
  
  createTaiKhoan(taikhoan: TaiKhoan): Promise<void>;

  taiKhoanExists(tenTaiKhoan: string): Promise<boolean>;

  findTaiKhoan(tenTaiKhoan: string): Promise<TaiKhoanDTO>;

  findTaiKhoanById(taikhoanId: string): Promise<TaiKhoanDTO>;

  deleteTaiKhoan(taikhoanId: string): Promise<void>;

  updateTaiKhoan(taikhoan: TaiKhoan): Promise<void>;
}