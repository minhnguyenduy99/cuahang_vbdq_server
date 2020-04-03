import IMapper from "./IMapper.interface";
import { SuccessResult, FailResult } from "@core";
import { NhaCungCap, NhaCungCapDTO } from "@modules/nhacungcap";

export default class NhaCungCapMapper implements IMapper<NhaCungCap> {
  
  toDTO(NhaCungCap: NhaCungCap) {
    return NhaCungCap.serialize();
  }

  toDTOFromPersistence(data: any) {
    if (!data) {
      return SuccessResult.ok(null);
    }
    return SuccessResult.ok({
      id: data.id,
      ten: data.ten,
      dia_chi: data.dia_chi,
      anh_dai_dien: data.anh_dai_dien,
      tong_gia_tri_nhap: data.tong_gia_tri_nhap
    } as NhaCungCapDTO);
  }
  
  toPersistenceFormat(NhaCungCap: NhaCungCap) {
    const dto = NhaCungCap.serialize();
    return {
      id: dto.id,
      ten: dto.ten,
      dia_chi: dto.dia_chi,
      anh_dai_dien: dto.anh_dai_dien,
      tong_gia_tri_nhap: dto.tong_gia_tri_nhap
    }
  }
}