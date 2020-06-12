import IMapper from "../core/IMapper.interface";
import { SanPham, SanPhamDTO } from "@modules/sanpham";

export default class SanPhamMapper implements IMapper<SanPham> {
  
  toDTO(SanPham: SanPham) {
    return SanPham.serialize();
  }

  toDTOFromPersistence(data: any) {
    if (!data) {
      return null;
    }
    return {
      idsp: data.id,
      ten_sp: data.ten,
      loai_sp: data.loai_sp,
      so_luong: data.so_luong,
      gia_ban: data.gia_ban,
      gia_nhap: data.gia_nhap,
      anh_dai_dien: data.anh_dai_dien,
      khoi_luong: data.khoi_luong,
      tieu_chuan: data.tieuchuan,
      ghi_chu: data.ghichu,
      nhacc_id: data.id_nhacc
    } as SanPhamDTO;
  }
  
  toPersistenceFormat(sanPham: SanPham) {
    const dto = sanPham.serialize();
    return {
      id: dto.idsp,
      ten: dto.ten_sp,
      loai_sp: dto.loai_sp,
      so_luong: dto.so_luong,
      gia_nhap: dto.gia_nhap,
      gia_ban: dto.gia_ban,
      anh_dai_dien: dto.anh_dai_dien,
      khoi_luong: dto.khoi_luong,
      tieuchuan: dto.tieu_chuan,
      ghichu: dto.ghi_chu,
      id_nhacc: dto.nhacc_id
    }
  }
}