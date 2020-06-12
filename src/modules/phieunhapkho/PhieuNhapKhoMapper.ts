import PhieuMapper from "../phieu/shared/phieu/PhieuMapper";
import { PhieuNhapKhoDTO, PhieuNhapKho } from ".";

export default class PhieuNhapKhoMapper extends PhieuMapper<PhieuNhapKho> {
  
  toDTOFromPersistence(data: any): PhieuNhapKhoDTO {
    let dto = super.toDTOFromPersistence(data);
    if (!dto) {
      return null;
    }
    return {
      ...dto,
      nhacc_id: data.nhacc_id
    } as PhieuNhapKhoDTO;
  }
  
  toPersistenceFormat(phieuNhapKho: PhieuNhapKho) {
    const phieuPersistence = super.toPersistenceFormat(phieuNhapKho);
    return {
      ...phieuPersistence,
      nhacc_id: phieuNhapKho.nhacungcap.id
    }
  }
}