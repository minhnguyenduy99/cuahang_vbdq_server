import { IDomainService, Result, SuccessResult, FailResult } from "@core";
import { SanPham } from "@modules/sanpham";
import { EntityNotFound } from "@core";
import { ValidationError } from "class-validator";


export default interface ISanPhamService extends IDomainService {

  findSanPhamById(sanphamId: string, findDeleted?: boolean): Promise<Result<SanPham, EntityNotFound>>;

  findSanPhamByNhaCC(nhaccId: string): Promise<SanPham[]>;

  updateAnhSanPham(sanpham: SanPham, imageFile: any): Promise<boolean>;

  persist(sanpham: SanPham): Promise<void>;

  updateSanPhamInfo(sanPham: SanPham, updateInfo: any): Promise<SuccessResult<SanPham> | FailResult<ValidationError[]>>;
}