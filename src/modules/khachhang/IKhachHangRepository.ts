import { IDatabaseRepository, IDatabaseError, Result } from "@core";
import KhachHang from "./KhachHang";
import { KhachHangDTO } from "./KhachHangProps";


export default interface IKhachHangRepository {

  createKhachHang(khachhang: KhachHang): Promise<Result<void, IDatabaseError>>;
  
  findKhachHangById(khachhangId: string): Promise<Result<KhachHangDTO, IDatabaseError>>;

  searchKhachHang(tenKH: string, cmnd: string): Promise<Result<KhachHangDTO[], IDatabaseError>>;

  update(khachhang: KhachHang): Promise<Result<void, IDatabaseError>>;
}