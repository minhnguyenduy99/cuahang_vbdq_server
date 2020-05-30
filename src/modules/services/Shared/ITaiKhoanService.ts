import { Result, IRepositoryError, IDomainService } from "@core";
import { TaiKhoan } from "@modules/taikhoan";
import { EntityNotFound } from "../DomainService";


export default interface ITaiKhoanService extends IDomainService {

  findTaiKhoanById(taikhoanId: string): Promise<Result<TaiKhoan, EntityNotFound>>;

  findTaiKhoanByTenDangNhap(tenDangNhap: string): Promise<Result<TaiKhoan, EntityNotFound>>;

  updateAnhDaiDien(taikhoanId: string, imageUrl: string): Promise<Result<any, EntityNotFound>>; 

  persist(taikhoan: TaiKhoan): Promise<any>;
}