import IMapper from "./IMapper.interface";
import { Result, IDatabaseError, FailResult, DatabaseError, MissingRequiredFieldsError, SuccessResult } from "@core";
import { TaiKhoan, TaiKhoanDTO } from "@modules/taikhoan";

export default class TaiKhoanMapper implements IMapper<TaiKhoan> {
  
  toDTO(TaiKhoan: TaiKhoan) {
    return TaiKhoan.serialize();
  }
  
  async toEntityFromPersistence(data: any): Promise<Result<TaiKhoan, IDatabaseError>> {
    const createTaiKhoan = await TaiKhoan.create({
      id: data.id,
      ten_tk: data.ten_dang_nhap,
      mat_khau: data.mat_khau,
      anh_dai_dien: data.anh_dai_dien,
      loai_tk: data.loai
    })
    if (createTaiKhoan.isFailure) {
      return FailResult.fail(new DatabaseError("DATA_PERSISTENCE_ERROR"));
    }
    return SuccessResult.ok(createTaiKhoan.getValue());
  }

  toDTOFromPersistence(data: any) {
    return SuccessResult.ok({
      id: data.id,
      ten_tk: data.ten_dang_nhap,
      mat_khau: data.mat_khau,
      anh_dai_dien: data.anh_dai_dien,
      loai_tk: data.loai
    } as TaiKhoanDTO);
  }
  
  toPersistenceFormat(taikhoan: TaiKhoan) {
    const dto = taikhoan.serialize();
    return {
      id: dto.id,
      ten_dang_nhap: dto.ten_tk,
      mat_khau: dto.mat_khau,
      anh_dai_dien: dto.anh_dai_dien,
      loai: dto.loai_tk
    }
  }
}