import { IDomainService, Result } from "@core";
import { SanPham } from "@modules/sanpham";
import { EntityNotFound } from "../DomainService";


export default interface ISanPhamService extends IDomainService {

  findSanPhamById(sanphamId: string): Promise<Result<SanPham, EntityNotFound>>;

  updateAnhSanPham(sanphamId: string, source: string): Promise<void>;

  persist(sanpham: SanPham): Promise<void>;
}