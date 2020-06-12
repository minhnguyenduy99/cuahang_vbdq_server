import IMapper from "../core/IMapper.interface";
import { TaiKhoan, TaiKhoanDTO } from "@modules/taikhoan";
import { CreateType } from "@modules/core";

export default class TaiKhoanMapper implements IMapper<TaiKhoan> {
  
  toDTO(TaiKhoan: TaiKhoan) {
    return TaiKhoan.serialize(CreateType.getGroups().toAppRespone);
  }

  toDTOFromPersistence(data: any) {
    if (!data) {
      return null;
    }
    return {
      id: data.id,
      ten_tk: data.ten_dang_nhap,
      mat_khau: data.mat_khau,
      anh_dai_dien: data.anh_dai_dien,
      loai_tk: data.loai
    } as TaiKhoanDTO;
  }
  
  toPersistenceFormat(taikhoan: TaiKhoan) {
    const dto = taikhoan.serialize(CreateType.getGroups().toPersistence);
    return {
      id: dto.id,
      ten_dang_nhap: dto.ten_tk,
      mat_khau: dto.mat_khau,
      anh_dai_dien: dto.anh_dai_dien,
      loai: dto.loai_tk
    }
  }
}