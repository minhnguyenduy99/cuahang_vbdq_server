import { IRepositoryError, Result } from "@core";
import KhachHang from "./KhachHang";
import { KhachHangDTO } from "./KhachHangProps";


export default interface IKhachHangRepository {

  createKhachHang(khachhang: KhachHang): Promise<Result<void, IRepositoryError>>;
  
  findKhachHangById(khachhangId: string): Promise<Result<KhachHangDTO, IRepositoryError>>;

  searchKhachHang(tenKH: string, cmnd: string): Promise<Result<KhachHangDTO[], IRepositoryError>>;

  update(khachhang: KhachHang): Promise<Result<void, IRepositoryError>>;
}