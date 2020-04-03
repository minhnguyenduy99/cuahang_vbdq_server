import { Expose } from "class-transformer";
import { IsPositive, IsInt, IsNumber, IsDivisibleBy, IsString, IsOptional, IsNotEmpty, IsNegative } from "class-validator";
import CreateType from "../entity-create-type";

export class SanPhamDTO {
  idsp: string;
  ten_sp: string;
  loai_sp: string;
  so_luong: string;
  gia_nhap: number;
  gia_ban: number;
  anh_dai_dien: number;
  khoi_luong: number;
  nhacc_id: string;
  tieu_chuan: string;
  ghi_chu: string;
}

export class SanPhamProps {
  
  @IsString({ groups: CreateType.getAllGroups() })
  @IsOptional({ groups: [CreateType.getGroups().createNew] })
  @Expose({ name: "idsp" })
  id: string;

  @IsNotEmpty({ groups: CreateType.getAllGroups() })
  @Expose({ name: "ten_sp" })
  tenSP: string;

  @IsNotEmpty({ groups: CreateType.getAllGroups() })
  @Expose({ name: "loai_sp" })
  loaiSP: string;

  @IsInt({ groups: CreateType.getAllGroups() })
  @IsPositive({ groups: CreateType.getAllGroups() })
  @Expose({ name: "so_luong"})
  soLuong: number;

  @IsNumber({ allowInfinity: false, allowNaN: false})
  @IsPositive({ groups: CreateType.getAllGroups() })
  @IsDivisibleBy(1000)
  @Expose({ name: "gia_nhap" })
  giaNhap: number;

  @IsNumber({ allowInfinity: false, allowNaN: false})
  @IsPositive({ groups: CreateType.getAllGroups() })
  @IsDivisibleBy(1000)
  @Expose({ name: "gia_ban" })
  giaBan: number;

  @IsOptional({ groups: [CreateType.getGroups().createNew] })
  @Expose({ name: "anh_dai_dien" })
  anhDaiDien: string;

  @IsNumber(undefined, { groups: CreateType.getAllGroups() })
  @IsPositive({ groups: CreateType.getAllGroups() })
  @Expose({ name: "khoi_luong" })
  khoiLuong: number;

  @Expose({ name: "nhacc_id" })
  idNhaCC: string;

  @IsString({ groups: CreateType.getAllGroups(), })
  @Expose({ name: "tieu_chuan" })
  tieuChuan: string;

  @Expose({ name: "ghi_chu" })
  @IsOptional({ groups: [CreateType.getGroups().createNew] })
  ghiChu: string;
}