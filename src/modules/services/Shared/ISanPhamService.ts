import { Result, IRepositoryError, IDomainService, BaseAppError } from "@core";
import { SanPham } from "@modules/sanpham";
import { EntityNotFound } from "../DomainService";
import { ValidationError } from "class-validator";


export default interface ISanPhamService extends IDomainService {

  findSanPhamById(taikhoanId: string): Promise<Result<SanPham, ValidationError[] | IRepositoryError | EntityNotFound>>;

  updateAnhSanPham(sanphamId: string, source: string): Promise<Result<void, IRepositoryError | BaseAppError>>

  persist(sanpham: SanPham): Promise<Result<void, IRepositoryError>>
}