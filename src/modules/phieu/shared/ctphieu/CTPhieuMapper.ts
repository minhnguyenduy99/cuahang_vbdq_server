import { CreateType, IMapper } from "@modules/core";
import ChiTietPhieu from "./ChiTietPhieu";
import ChiTietPhieuDTO from "./ChiTietPhieuDTO";

export default abstract class CTPhieuMapper implements IMapper<ChiTietPhieu<any>> {
  
  toDTO(ctphieu: ChiTietPhieu<any>) {
    return ctphieu.serialize(CreateType.getGroups().toAppRespone);
  }
  
  toDTOFromPersistence(data: any) {
    if (!data) {
      return { } as ChiTietPhieuDTO;
    }
    return {
      phieu_id: data.phieu_id,
      so_luong: data.so_luong,
      gia_tri: data.gia_tri
    } as ChiTietPhieuDTO;
  }
  
  toPersistenceFormat(ctphieu: ChiTietPhieu<any>) {
    const dto = ctphieu.serialize(CreateType.getGroups().toPersistence);
    return {
      phieu_id: dto.phieu_id,
      so_luong: dto.so_luong,
      gia_tri: dto.gia_tri
    }
  }
}
