import { IDatabaseRepository, Result, IDatabaseError } from "@core";
import { TaiKhoan, } from "./TaiKhoan";

export default interface ITaiKhoanRepository extends IDatabaseRepository<any> {
  
  createTaiKhoan(taikhoan: TaiKhoan): Promise<Result<void, IDatabaseError>>;

  taiKhoanExists(tenTaiKhoan: string): Promise<Result<boolean, IDatabaseError>>;
}