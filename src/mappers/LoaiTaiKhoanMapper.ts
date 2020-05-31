
import IMapper from "./IMapper.interface";
import { LoaiTaiKhoanDTO, LoaiTaiKhoan } from "@modules/loaitaikhoan";

export default class LoaiTaiKhoanMapper implements IMapper<LoaiTaiKhoan> {
  
  toDTO(LoaiTaiKhoan: LoaiTaiKhoan) {
    return LoaiTaiKhoan.serialize();
  }

  toDTOFromPersistence(data: any) {
    if (!data) {
      return null;
    }
    return {
      ma_ltk: data.ma_ltk,
      ten_ltk: data.ten_ltk
    } as LoaiTaiKhoanDTO;
  }
  
  toPersistenceFormat(LoaiTaiKhoan: LoaiTaiKhoan) {
    const dto = LoaiTaiKhoan.serialize();
    return {
      ma_ltk: dto.ma_ltk,
      ten_ltk: dto.ten_ltk
    }
  }
}