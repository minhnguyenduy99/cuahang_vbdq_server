import IMapper from "./IMapper.interface";
import * as nv from "@modules/nhanvien";
import { NhanVienDTO } from "@modules/nhanvien";
import CreateType from "@create_type";

export default class NhanVienMapper implements IMapper<nv.NhanVien> {
  
  toDTO(nhanvien: nv.NhanVien) {
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
      chuc_vu: data.chuc_vu,
      luong: data.luong,
      cmnd: data.cmnd,
      gioi_tinh: data.gioi_tinh,
      sdt: data.sdt,
      dia_chi: data.dia_chi,
      ghi_chu: data.ghi_chu
    } as NhanVienDTO;
  }
  
  toPersistenceFormat(nhanvien: nv.NhanVien) {
    const dto = nhanvien.serialize(CreateType.getGroups().toPersistence);
    return {
      id: dto.id,
      nv_quanly_id: dto.idql,
      ho_ten: dto.ho_ten,
      chuc_vu: dto.chuc_vu,
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