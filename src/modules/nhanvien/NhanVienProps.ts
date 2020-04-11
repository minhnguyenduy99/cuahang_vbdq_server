import { Expose, Type, TransformClassToPlain, TransformPlainToClass } from "class-transformer";
import { IsIn, IsNumber, IsPositive, IsDivisibleBy, IsString, IsOptional, IsNotEmpty, IsDateString, IsDate, IsDefined, IsEmpty, Validate, ValidateIf } from "class-validator";
import CreateType from "../entity-create-type";
import { IsCMND, IsVNPhoneNumber, IsMoney } from "../helpers/custom-validator";

export default class NhanVienProps {

  @IsString({ groups: CreateType.getAllGroupsExcept("createNew") })
  @IsEmpty({ groups: [CreateType.getGroups().createNew] })
  @Expose()
  id: string;
  
  @IsString({ groups: CreateType.getAllGroups() })
  @IsOptional({ groups: CreateType.getAllGroups() })
  @Expose()
  idql: string;

  @IsIn(["NHANVIEN", "KHACHHANG"], { groups: CreateType.getAllGroups() })
  @Expose({ name: "chuc_vu"})
  chucvu: string;

  @IsOptional({ groups: [CreateType.getGroups().createNew] })
  @Validate(IsMoney, { groups: CreateType.getAllGroupsExcept("createNew") })
  @ValidateIf((val) => val, { groups: [CreateType.getGroups().createNew] })
  @Expose()
  luong: number;

  @Expose({ name: "ho_ten"})
  @IsNotEmpty({ groups: CreateType.getAllGroups() })
  hoTen: string;

  @Validate(IsCMND, { groups: CreateType.getAllGroups() })
  @Expose()
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

  @IsOptional({ groups: CreateType.getAllGroups() })
  @IsString({ groups: CreateType.getAllGroups() })
  @Expose({ name: "ghi_chu" })
  ghichu: string;

  @Expose({ name: "tk_id" })
  @IsNotEmpty({ groups: CreateType.getAllGroupsExcept("createNew") })
  taiKhoanId: string;
}