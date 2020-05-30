import { IRepositoryError, Result } from "@core";
import KhachHang from "./KhachHang";
import { KhachHangDTO } from "./KhachHangProps";


export default interface IKhachHangRepository {

  createKhachHang(khachhang: KhachHang): Promise<void>;
  
  findKhachHangById(khachhangId: string): Promise<KhachHangDTO>;

  searchKhachHang(tenKH: string, cmnd: string): Promise<KhachHangDTO[]>;

  update(khachhang: KhachHang): Promise<void>;

  findKhachHangByCMND(cmnd: string): Promise<KhachHangDTO>;
}