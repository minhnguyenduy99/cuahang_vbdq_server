import { Expose, Transform } from "class-transformer";
import { IsPositive, IsInt, IsNumber, IsDivisibleBy, IsString, IsOptional, IsNotEmpty, IsNegative, IsEmpty, Validate } from "class-validator";
import CreateType from "../entity-create-type";
import { StringToNumber } from "../helpers/CustomTransform";
import { IsImage } from "../helpers/custom-validator";

export interface SanPhamDTO {
  idsp: string;
  ten_sp: string;
  loai_sp: string;
  so_luong: number;
  gia_nhap: number;
  gia_ban: number;
  anh_dai_dien: number;
  khoi_luong: number;
  nhacc_id: string;
  tieu_chuan: string;
  ghi_chu: string;
}

export class SanPhamProps {
  
  @IsString({ groups: CreateType.getAllGroupsExcept("createNew") })
  @IsEmpty({ groups: [CreateType.getGroups().createNew] })
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
  @Transform(StringToNumber)
  soLuong: number;

  @IsNumber({ allowInfinity: false, allowNaN: false})
  @IsPositive({ groups: CreateType.getAllGroups() })
  @IsDivisibleBy(1000)
  @Expose({ name: "gia_nhap" })
  @Transform(StringToNumber)
  giaNhap: number;

  @IsNumber({ allowInfinity: false, allowNaN: false}, { groups: CreateType.getAllGroups() })
  @IsPositive({ groups: CreateType.getAllGroups() })
  @IsDivisibleBy(1000)
  @Expose({ name: "gia_ban" })
  @Transform(StringToNumber)
  giaBan: number;

  @IsOptional({ groups: [CreateType.getGroups().createNew] })
  @Validate(IsImage, { groups: CreateType.getAllGroupsExcept("createNew") })
  @Expose({ name: "anh_dai_dien" })
  anhDaiDien: string;

  @IsNumber(undefined, { groups: CreateType.getAllGroups() })
  @IsPositive({ groups: CreateType.getAllGroups() })
  @Expose({ name: "khoi_luong" })
  @Transform(StringToNumber)
  khoiLuong: number;

  @Expose({ name: "nhacc_id" })
  @IsNotEmpty({ groups: CreateType.getAllGroups() })
  idNhaCC: string;

  @IsString({ groups: CreateType.getAllGroups() })
  @IsOptional({ groups: [CreateType.getGroups().createNew] })
  @Expose({ name: "tieu_chuan" })
  tieuChuan: string;

  @Expose({ name: "ghi_chu" })
  @IsOptional({ groups: [CreateType.getGroups().createNew] })
  ghiChu: string;
}