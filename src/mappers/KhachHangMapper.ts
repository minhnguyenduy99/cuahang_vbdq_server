import IMapper from "./IMapper.interface";
import { KhachHang, KhachHangDTO } from "@modules/khachhang";
import { IDatabaseError, Result, SuccessResult } from "@core";


export default class KhachHangMapper implements IMapper<KhachHang> {

  toDTO(khachhang: KhachHang) {
    return khachhang.serialize();
  }

  toDTOFromPersistence(data: any) {
    return {
      id: data.id,
      ten_kh: data.ho_ten,
      cmnd: data.cmnd,
      tong_gia_tri_ban: data.tong_gia_tri_ban,
      tong_gia_tri_mua: data.tong_gia_tri_mua
    } as KhachHangDTO;
  }
  
  toPersistenceFormat(khachhang: KhachHang) {
    const dto = khachhang.serialize();
    return {
      id: dto.id,
      ho_ten: dto.ten_kh,
      cmnd: dto.cmnd,
      tong_gia_tri_ban: dto.tong_gia_tri_ban,
      tong_gia_tri_mua: dto.tong_gia_tri_mua
    }
  }
}