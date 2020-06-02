import { LimitResult } from "@core";
import { SanPham } from "@modules/sanpham";
import SanPhamDTO from "./SanPhamDTO";

export default interface ISanPhamRepository {

  createSanPham(sanpham: SanPham): Promise<void>;

  searchSanPham(tenSP: string, loaiSP: string, limit: LimitResult): Promise<SanPhamDTO[]>;

  getSanPhamById(sanphamId: string): Promise<SanPhamDTO>;

  persist(sanpham: SanPham): Promise<void>;

  getSanPhamByIdNhaCC(nhaccId: string): Promise<SanPhamDTO[]>;
}