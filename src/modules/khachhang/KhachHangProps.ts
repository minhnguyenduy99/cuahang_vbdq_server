import { IsString, IsOptional, IsNotEmpty, IsEmpty, Validate, IsDate } from "class-validator";
import CreateType from "../entity-create-type";
import { Expose, Type } from "class-transformer";
import { IsCMND, IsMoney, IsVNPhoneNumber } from "../helpers/custom-validator";


export interface KhachHangDTO {
  id: string;
  ten_kh: string;
  cmnd: string;
  ngay_sinh: Date;
  gioi_tinh: string;
  dia_chi: string;
  sdt: string;
  tong_gia_tri_ban: number;
  tong_gia_tri_mua: number;
}

export class KhachHangProps {

  @IsString({ groups: CreateType.getAllGroups() })
  @IsOptional({ groups: [CreateType.getGroups().createNew] })
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