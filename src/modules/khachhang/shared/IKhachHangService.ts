import { Result, IDomainService } from "@core";
import { KhachHang } from '@modules/khachhang';
import { EntityNotFound } from "@core";

export default interface IKhachHangService extends IDomainService {
  
  getKhachHangById(khachhangId: string): Promise<Result<KhachHang, EntityNotFound>>;

  persist(khachhang: KhachHang): Promise<void>;
}