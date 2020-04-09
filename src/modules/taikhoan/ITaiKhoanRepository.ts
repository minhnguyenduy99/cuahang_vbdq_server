import { IDatabaseRepository, Result, IDatabaseError } from "@core";
import { TaiKhoan, TaiKhoanDTO } from "./TaiKhoan";

export default interface ITaiKhoanRepository extends IDatabaseRepository<any> {
  
  createTaiKhoan(taikhoan: TaiKhoan): Promise<Result<void, IDatabaseError>>;

  taiKhoanExists(tenTaiKhoan: string): Promise<Result<boolean, IDatabaseError>>;

  findTaiKhoan(tenTaiKhoan: string): Promise<Result<TaiKhoanDTO, IDatabaseError>>;

  findTaiKhoanById(taikhoanId: string): Promise<Result<TaiKhoanDTO, IDatabaseError>>;

  persist(taiKhoan: TaiKhoan): Promise<Result<void, IDatabaseError>>;

  deleteTaiKhoan(taikhoanId: string): Promise<Result<void, IDatabaseError>>;
}