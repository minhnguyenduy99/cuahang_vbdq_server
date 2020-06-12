import { KhachHangDTO, KhachHang } from "@modules/khachhang";

export default interface IKhachHangRepository {

  createKhachHang(khachhang: KhachHang): Promise<void>;
  
  findKhachHangById(khachhangId: string): Promise<KhachHangDTO>;

  findKhachHangByTaiKhoan(taikhoanId: string): Promise<KhachHangDTO>;

  searchKhachHang(tenKH: string, cmnd: string, from: number, count?: number): Promise<KhachHangDTO[]>;

  getSoLuongSearch(tenKH: string, cmnd: string): Promise<number>;

  update(khachhang: KhachHang): Promise<void>;

  findKhachHangByCMND(cmnd: string): Promise<KhachHangDTO>;

  deleteKhachHang(khachangId: string): Promise<number>;

  searchKhachHangLimit(from: number, count?: number): Promise<KhachHangDTO[]>;
}