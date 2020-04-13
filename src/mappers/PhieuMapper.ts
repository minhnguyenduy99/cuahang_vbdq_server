import IMapper from "./IMapper.interface";
import { Phieu, PhieuDTO } from "@modules/phieu";
import CreateType from "@create_type";


export default class PhieuMapper<T extends Phieu> implements IMapper<T> {
  
  toDTO(phieu: T) {
    return phieu.serialize(CreateType.getGroups().toAppRespone);
  }
  
  toDTOFromPersistence(data: any): PhieuDTO {
    if (!data) {
      return null;
    }
    return {
      id: data.id,
      ngay_lap: data.ngay_lap,
      tong_gia_tri: data.tong_gia_tri,
      kh_id: data.kh_id,
      nv_id: data.nv_id,
      loai_phieu: data.loai_phieu
    } as PhieuDTO;
  }
  
  toPersistenceFormat(phieu: T) {
    const dto = phieu.serialize(CreateType.getGroups().toPersistence) as PhieuDTO;
    return {
      id: dto.id,
      ngay_lap: dto.ngay_lap,
      tong_gia_tri: dto.tong_gia_tri,
      nv_id: dto.nv_id,
      loai_phieu: dto.loai_phieu
    }
  }
}