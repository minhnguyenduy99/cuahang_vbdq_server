import { Result, IRepositoryError } from "@core";
import { TaiKhoan, TaiKhoanDTO } from "./TaiKhoan";

export default interface ITaiKhoanRepository {
  
  createTaiKhoan(taikhoan: TaiKhoan): Promise<Result<void, IRepositoryError>>;

  taiKhoanExists(tenTaiKhoan: string): Promise<Result<boolean, IRepositoryError>>;

  findTaiKhoan(tenTaiKhoan: string): Promise<Result<TaiKhoanDTO, IRepositoryError>>;

  findTaiKhoanById(taikhoanId: string): Promise<Result<TaiKhoanDTO, IRepositoryError>>;

  deleteTaiKhoan(taikhoanId: string): Promise<Result<void, IRepositoryError>>;

  updateTaiKhoan(taikhoan: TaiKhoan): Promise<Result<void, IRepositoryError>>;
}