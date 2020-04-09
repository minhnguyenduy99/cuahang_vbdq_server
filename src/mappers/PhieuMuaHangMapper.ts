import IMapper from "./IMapper.interface";
import { PhieuBanHang, PhieuBanHangDTO } from "@modules/phieubanhang";
import { IDatabaseError, Result, SuccessResult } from "@core";


export default class PhieuBanHangMapper implements IMapper<PhieuBanHang> {
  
  toDTO(phieuBanHang: PhieuBanHang) {
    return phieuBanHang.serialize();
  }
  
  toDTOFromPersistence(data: any): Result<PhieuBanHangDTO, IDatabaseError> {
    return SuccessResult.ok({
      id: data.id,
      ngay_lap: data.ngay_lap,
      tong_gia_tri: data.tong_gia_tri,
      kh_id: data.kh_id,
      nv_id: data.nv_id,
      loai_phieu: data.loai_phieu
    } as PhieuBanHangDTO)
  }
  
  toPersistenceFormat(phieuBanHang: PhieuBanHang) {
    const dto = phieuBanHang.serialize();
    return {
      id: dto.id,
      ngay_lap: dto.ngay_lap,
      tong_gia_tri: dto.tong_gia_tri,
      kh_id: dto.kh_id,
      nv_id: dto.nv_id,
      loai_phieu: dto.loai_phieu
    }
  }
}