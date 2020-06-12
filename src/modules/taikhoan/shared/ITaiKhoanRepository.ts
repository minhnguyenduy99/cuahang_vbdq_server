import { TaiKhoan, TaiKhoanDTO } from "../TaiKhoan";

export default interface ITaiKhoanRepository {
  
  createTaiKhoan(taikhoan: TaiKhoan): Promise<void>;

  taiKhoanExists(tenTaiKhoan: string): Promise<boolean>;

  findTaiKhoan(tenTaiKhoan: string): Promise<TaiKhoanDTO>;

  findTaiKhoanById(taikhoanId: string, findDeleted?: boolean): Promise<TaiKhoanDTO>;

  findTaiKhoanByLimit(from: number, count?: number): Promise<TaiKhoanDTO[]>;

  deleteTaiKhoan(taikhoanId: string): Promise<boolean>;

  updateTaiKhoan(taikhoan: TaiKhoan): Promise<void>;
}