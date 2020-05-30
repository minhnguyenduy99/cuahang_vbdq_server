import { IRepositoryError, Result, LimitResult } from "@core";
import { SanPhamDTO } from "./SanPhamProps";
import { SanPham } from ".";


export default interface ISanPhamRepository {

  createSanPham(sanpham: SanPham): Promise<void>;

  searchSanPham(tenSP: string, loaiSP: string, limit: LimitResult): Promise<SanPhamDTO[]>;

  getSanPhamById(sanphamId: string): Promise<SanPhamDTO>;

  persist(sanpham: SanPham): Promise<void>;
}