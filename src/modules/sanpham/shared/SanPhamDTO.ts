export default interface SanPhamDTO {
  idsp: string;
  ten_sp: string;
  loai_sp: string;
  so_luong?: number;
  gia_nhap: number;
  gia_ban: number;
  anh_dai_dien: number;
  khoi_luong: number;
  nhacc_id: string;
  tieu_chuan: string;
  ghi_chu: string;
}