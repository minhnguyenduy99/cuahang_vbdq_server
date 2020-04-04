import { IDatabaseRepository, IDatabaseError, Result, LimitResult } from "@core";
import { SanPhamDTO } from "./SanPhamProps";
import { SanPham } from ".";


export default interface ISanPhamRepository extends IDatabaseRepository<any> {

  createSanPham(sanpham: SanPham): Promise<Result<void, IDatabaseError>>;

  searchSanPham(tenSP: string, loaiSP: string, limit: LimitResult): Promise<Result<SanPhamDTO[], IDatabaseError>>;

  getSanPhamById(sanphamId: string): Promise<Result<SanPhamDTO, IDatabaseError>>;
}