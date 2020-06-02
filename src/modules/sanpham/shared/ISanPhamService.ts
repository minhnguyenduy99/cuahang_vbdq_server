import { IDomainService, Result } from "@core";
import { SanPham } from "@modules/sanpham";
import { EntityNotFound } from "@core";


export default interface ISanPhamService extends IDomainService {

  findSanPhamById(sanphamId: string): Promise<Result<SanPham, EntityNotFound>>;

  findSanPhamByNhaCC(nhaccId: string): Promise<SanPham[]>;

  updateAnhSanPham(sanphamId: string, source: string): Promise<void>;

  persist(sanpham: SanPham): Promise<void>;
}