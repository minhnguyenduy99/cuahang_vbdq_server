import { IMapper } from "@modules/core"
import { NhanVienDTO, NhanVien } from "@modules/nhanvien";
import { CreateType } from "@modules/core";

export default class NhanVienMapper implements IMapper<NhanVien> {
  
  toDTO(nhanvien: NhanVien) {
    return nhanvien.serialize(CreateType.getGroups().toAppRespone);
  }

  toDTOFromPersistence(data: any): NhanVienDTO {
    if (!data) {
      return null as NhanVienDTO;
    }
    return {
      id: data.id,
      tk_id: data.tk_id,
      idql: data.nv_quanly_id,
      ho_ten: data.ho_ten,
      ngay_sinh: data.ngay_sinh,
      luong: data.luong,
      cmnd: data.cmnd,
      gioi_tinh: data.gioi_tinh,
      sdt: data.sdt,
      dia_chi: data.dia_chi,
      ghi_chu: data.ghi_chu
    } as NhanVienDTO;
  }
  
  toPersistenceFormat(nhanvien: NhanVien) {
    const dto = nhanvien.serialize(CreateType.getGroups().toPersistence);
    return {
      id: dto.id,
      nv_quanly_id: dto.idql,
      ho_ten: dto.ho_ten,
      ngay_sinh: dto.ngay_sinh,
      cmnd: dto.cmnd,
      gioi_tinh: dto.gioi_tinh,
      sdt: dto.sdt,
      dia_chi: dto.dia_chi,
      ghi_chu: dto.ghi_chu,
      tk_id: nhanvien.taikhoanId
    }
  }
}