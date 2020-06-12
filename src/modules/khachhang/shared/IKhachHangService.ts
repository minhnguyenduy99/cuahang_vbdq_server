import { Result, IDomainService } from "@core";
import { KhachHang } from '@modules/khachhang';
import { EntityNotFound } from "@core";
import { ValidationError } from "class-validator";

export default interface IKhachHangService extends IDomainService {
  
  getKhachHangById(khachhangId: string): Promise<Result<KhachHang, EntityNotFound>>;

  updateKhachHang(khachHang: KhachHang, updateInfo: any): Promise<Result<KhachHang, ValidationError[]>>;

  persist(khachhang: KhachHang): Promise<void>;
}