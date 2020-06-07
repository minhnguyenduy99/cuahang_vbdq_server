import { KhachHangDTO, KhachHang } from "@modules/khachhang";
import { LimitResult } from "@core";

export default interface IKhachHangRepository {

  createKhachHang(khachhang: KhachHang): Promise<void>;
  
  findKhachHangById(khachhangId: string): Promise<KhachHangDTO>;

  searchKhachHang(tenKH: string, cmnd: string): Promise<KhachHangDTO[]>;

  update(khachhang: KhachHang): Promise<void>;

  findKhachHangByCMND(cmnd: string): Promise<KhachHangDTO>;

  deleteKhachHang(khachangId: string): Promise<number>;

  searchKhachHangLimit(from: number, count?: number): Promise<KhachHangDTO[]>;
}