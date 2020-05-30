import { DomainService, Result } from "@core";
import { KhachHang } from '@modules/khachhang';
import { EntityNotFound } from "../DomainService";

export default interface IKhachHangService extends DomainService {
  
  getKhachHangById(khachhangId: string): Promise<Result<KhachHang, EntityNotFound>>;

  persist(khachhang: KhachHang): Promise<void>;
}