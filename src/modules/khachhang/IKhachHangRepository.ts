import { IDatabaseRepository, IDatabaseError, Result } from "@core";
import KhachHang from "./KhachHang";
import { KhachHangDTO } from "./KhachHangProps";


export default interface IKhachHangRepository extends IDatabaseRepository<any> {

  createKhachHang(khachhang: KhachHang): Promise<Result<void, IDatabaseError>>;
  
  findKhachHangById(khachhangId: string): Promise<Result<KhachHangDTO, IDatabaseError>>;

  searchKhachHang(tenKH: string, cmnd: string): Promise<Result<KhachHangDTO[], IDatabaseError>>;

  persist(khachhang: KhachHang): Promise<Result<void, IDatabaseError>>;
}