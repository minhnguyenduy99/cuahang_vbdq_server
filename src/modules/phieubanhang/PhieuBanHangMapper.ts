import { PhieuMapper } from "@modules/phieu/shared";
import { PhieuBanHangDTO, PhieuBanHang } from ".";

export default class PhieuBanHangMapper extends PhieuMapper<PhieuBanHang> {
  
  toDTOFromPersistence(data: any): PhieuBanHangDTO {
    let dto = super.toDTOFromPersistence(data);
    if (!dto) {
      return null;
    }
    return {
      ...dto,
      kh_id: data.kh_id
    } as PhieuBanHangDTO;
  }
  
  toPersistenceFormat(phieuBanHang: PhieuBanHang) {
    const phieuPersistence = super.toPersistenceFormat(phieuBanHang);
    return {
      ...phieuPersistence,
      kh_id: phieuBanHang.khachHang.khachHangId
    }
  }
}