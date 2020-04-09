import IMapper from "./IMapper.interface";
import { CTPhieuBanHang, CTPhieuBanHangDTO } from "@modules/ctphieubanhang";
import CreateType from "@create_type";
import { IDatabaseError, Result, SuccessResult } from "@core";

export default class CTPhieuMHMapper implements IMapper<CTPhieuBanHang> {
  
  toDTO(ctphieu: CTPhieuBanHang) {
    return ctphieu.serialize(CreateType.getGroups().toAppRespone);
  }
  
  toDTOFromPersistence(data: any): Result<CTPhieuBanHangDTO, IDatabaseError> {
    return SuccessResult.ok({
      phieu_mh_id: data.pmhang_id,
      sp_id: data.sp_id,
      so_luong: data.so_luong,
      gia_tri: data.gia_tri
    } as CTPhieuBanHangDTO);
  }
  
  toPersistenceFormat(ctphieu: CTPhieuBanHang) {
    const dto = this.toDTO(ctphieu);
    return {
      pmhang_id: dto.phieu_mh_id,
      sp_id: dto.sp_id,
      so_luong: dto.so_luong,
      gia_tri: dto.gia_tri
    }
  }
}
