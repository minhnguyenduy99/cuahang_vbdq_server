import { Result, IRepositoryError, IDomainService } from "@core";
import { TaiKhoan } from "@modules/taikhoan";
import { EntityNotFound } from "@core";
import { ValidationError } from "class-validator";


export default interface ITaiKhoanService extends IDomainService {

  findTaiKhoanById(taikhoanId: string): Promise<Result<TaiKhoan, EntityNotFound>>;

  findTaiKhoanByTenDangNhap(tenDangNhap: string): Promise<Result<TaiKhoan, EntityNotFound>>;

  updateAnhDaiDien(taikhoan: string | TaiKhoan, imageFile: any | "usedefault"): Promise<Result<any, EntityNotFound | Error>>;
  
  updateTaiKhoan(taiKhoan: TaiKhoan, data: any): Promise<Result<TaiKhoan, ValidationError[] | any>>;

  persist(taikhoan: TaiKhoan): Promise<any>;
}