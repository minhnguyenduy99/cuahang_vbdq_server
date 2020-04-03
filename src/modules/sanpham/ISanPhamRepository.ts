import { IDatabaseRepository, IDatabaseError, Result } from "@core";
import { SanPhamDTO } from "./SanPhamProps";
import { SanPham } from ".";


export default interface ISanPhamRepository extends IDatabaseRepository {

  createSanPham(sanpham: SanPham): Promise<Result<void, IDatabaseError>>;

  getSanPhamById(sanphamId: string): Promise<Result<SanPhamDTO, IDatabaseError>>;
}