import Phieu from "./Phieu";
import PhieuDTO from "./PhieuDTO";
import { CreateType, IMapper } from "@modules/core";

export default abstract class PhieuMapper<T extends Phieu> implements IMapper<T> {
  
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
      nv_id: data.nv_id
    } as PhieuDTO;
  }
  
  toPersistenceFormat(phieu: T) {
    const dto = phieu.serialize(CreateType.getGroups().toPersistence) as PhieuDTO;
    return {
      id: dto.id,
      ngay_lap: dto.ngay_lap,
      tong_gia_tri: dto.tong_gia_tri,
      nv_id: dto.nv_id
    }
  }
}