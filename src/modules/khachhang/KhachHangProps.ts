import { IsString, IsOptional, IsNotEmpty, IsEmpty, Validate, IsDate } from "class-validator";
import { Expose, Type } from "class-transformer";
import { CreateType } from "@modules/core";
import { IsCMND, IsMoney, IsVNPhoneNumber } from "@modules/helpers";

export default class KhachHangProps {

  @IsString({ groups: CreateType.getAllGroups() })
  @IsOptional({ groups: [CreateType.getGroups().createNew, CreateType.getGroups().update] })
  @Expose({ groups: CreateType.getAllGroups() })
  id: string;

  @IsString({ groups: CreateType.getAllGroups() })
  @IsNotEmpty({ groups: CreateType.getAllGroups() })
  @Expose({ name: "ten_kh" })
  ten: string;

  @IsNotEmpty({ groups: CreateType.getAllGroups() })
  @Validate(IsCMND, { groups: CreateType.getAllGroups() })
  @Expose({ groups: CreateType.getAllGroups() })
  cmnd: string;

  @Expose({ name: "ngay_sinh" })
  @Type(() => Date)
  @IsDate({ groups: CreateType.getAllGroups() })
  ngaySinh: Date;

  @Expose({ name: "gioi_tinh"})
  gioiTinh: string;

  @Validate(IsVNPhoneNumber, { groups: CreateType.getAllGroups() })
  @Expose()
  sdt: string;

  @IsOptional({ groups: CreateType.getAllGroups() })
  @IsString({ groups: CreateType.getAllGroups() })
  @Expose({ name: "dia_chi" })
  diachi: string;

  @IsEmpty({ groups: [CreateType.getGroups().createNew] })
  @Validate(IsMoney, { groups: CreateType.getAllGroupsExcept("createNew") })
  @Expose({ name: "tong_gia_tri_ban" })
  tongGiaTriBan: number;

  @IsEmpty({ groups: [CreateType.getGroups().createNew] })
  @Validate(IsMoney, { groups: CreateType.getAllGroupsExcept("createNew") })
  @Expose({ name: "tong_gia_tri_mua" })
  tongGiaTriMua: number;
}