import { Expose, Transform } from "class-transformer";
import { IsPositive, IsInt, IsNumber, IsDivisibleBy, IsString, IsOptional, IsNotEmpty, IsNegative, IsEmpty, Validate } from "class-validator";
import CreateType from "../core/entity-create-type";
import { StringToNumber } from "@modules/helpers";
import { IsImage } from "../helpers/custom-validator";



export default class SanPhamProps {
  
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

  @IsInt({ groups: CreateType.getAllGroupsExcept("createNew") })
  @Transform(StringToNumber, { groups: CreateType.getAllGroupsExcept("createNew") })
  @IsEmpty({ groups: [CreateType.getGroups().createNew] })
  @Expose({ name: "so_luong"})
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

  @IsOptional({ groups: [CreateType.getGroups().createNew] })
  @Expose({ name: "tieu_chuan" })
  tieuChuan: string;

  @Expose({ name: "ghi_chu" })
  @IsOptional({ groups: [CreateType.getGroups().createNew] })
  ghiChu: string;
}