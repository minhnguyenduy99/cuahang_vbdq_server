import { LimitResult } from "@core";
import { SanPham } from "@modules/sanpham";
import SanPhamDTO from "./SanPhamDTO";

export default interface ISanPhamRepository {

  getSoLuong(): Promise<number>;

  createSanPham(sanpham: SanPham): Promise<void>;

  searchSanPham(tenSP: string, loaiSP: string, limit: LimitResult): Promise<SanPhamDTO[]>;

  getSanPhamById(sanphamId: string, findDeleted?: boolean): Promise<SanPhamDTO>;

  persist(sanpham: SanPham): Promise<void>;

  getSanPhamByIdNhaCC(nhaccId: string, findDeleted?: boolean): Promise<SanPhamDTO[]>;

  deleteSanPham(sanpham: SanPham | string): Promise<void>;
}