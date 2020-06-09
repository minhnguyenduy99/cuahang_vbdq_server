import { KhachHang, KhachHangDTO } from "@modules/khachhang";
import { CreateType, IMapper } from "@modules/core";

export default class KhachHangMapper implements IMapper<KhachHang> {

  toDTO(khachhang: KhachHang) {
    return khachhang.serialize(CreateType.getGroups().toAppRespone);
  }

  toDTOFromPersistence(data: any) {
    if (!data) {
      return null;
    }
    return {
      id: data.id,
      tk_id: data.tk_id,
      ten_kh: data.ho_ten,
      cmnd: data.cmnd,
      gioi_tinh: data.gioi_tinh,
      ngay_sinh: data.ngay_sinh,
      dia_chi: data.dia_chi,
      sdt: data.sdt,
      tong_gia_tri_ban: data.tong_gia_tri_ban,
      tong_gia_tri_mua: data.tong_gia_tri_mua
    } as KhachHangDTO;
  }
  
  toPersistenceFormat(khachhang: KhachHang) {
    const dto = khachhang.serialize(CreateType.getGroups().toPersistence);
    return {
      id: dto.id,
      tk_id: dto.tk_id,
      ho_ten: dto.ten_kh,
      cmnd: dto.cmnd,
      tong_gia_tri_ban: dto.tong_gia_tri_ban,
      tong_gia_tri_mua: dto.tong_gia_tri_mua,
      gioi_tinh: dto.gioi_tinh,
      ngay_sinh: dto.ngay_sinh,
      dia_chi: dto.dia_chi,
      sdt: dto.sdt
    }
  }
}