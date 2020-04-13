import IMapper from "./IMapper.interface";
import CreateType from "@create_type";
import { ChiTietPhieu, ChiTietPhieuDTO } from "@modules/phieu";

export default class CTPhieuMapper implements IMapper<ChiTietPhieu> {
  
  toDTO(ctphieu: ChiTietPhieu) {
    return ctphieu.serialize(CreateType.getGroups().toAppRespone);
  }
  
  toDTOFromPersistence(data: any) {
    if (!data) {
      return { } as ChiTietPhieuDTO;
    }
    return {
      phieu_id: data.phieu_id,
      sp_id: data.sp_id,
      so_luong: data.so_luong,
      gia_tri: data.gia_tri
    } as ChiTietPhieuDTO;
  }
  
  toPersistenceFormat(ctphieu: ChiTietPhieu) {
    const dto = ctphieu.serialize(CreateType.getGroups().toPersistence);
    return {
      phieu_id: dto.phieu_id,
      sp_id: dto.sp_id,
      so_luong: dto.so_luong,
      gia_tri: dto.gia_tri
    }
  }
}
