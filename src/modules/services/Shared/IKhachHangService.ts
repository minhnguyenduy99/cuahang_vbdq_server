import { DomainServiceError, DomainService, UnknownAppError, Result, IRepositoryError } from "@core";
import { KhachHang } from '@modules/khachhang';

export default interface IKhachHangService extends DomainService {
  
  getKhachHangById(khachhangId: string): Promise<Result<KhachHang, IRepositoryError | UnknownAppError>>;

  persist(khachhang: KhachHang): Promise<Result<void, IRepositoryError>>;
}