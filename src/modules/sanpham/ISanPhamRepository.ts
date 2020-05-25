import { IRepositoryError, Result, LimitResult } from "@core";
import { SanPhamDTO } from "./SanPhamProps";
import { SanPham } from ".";


export default interface ISanPhamRepository {

  createSanPham(sanpham: SanPham): Promise<Result<void, IRepositoryError>>;

  searchSanPham(tenSP: string, loaiSP: string, limit: LimitResult): Promise<Result<SanPhamDTO[], IRepositoryError>>;

  getSanPhamById(sanphamId: string): Promise<Result<SanPhamDTO, any>>;

  persist(sanpham: SanPham): Promise<Result<void, IRepositoryError>>;
}