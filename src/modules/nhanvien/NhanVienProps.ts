import { Expose, Type, TransformClassToPlain, TransformPlainToClass } from "class-transformer";
import { IsIn, IsNumber, IsPositive, IsDivisibleBy, IsString, IsOptional, Matches, IsNotEmpty, IsDateString, IsDate, IsDefined, IsEmpty } from "class-validator";
import CreateType from "../entity-create-type";

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

  @IsOptional({ groups: CreateType.getAllGroups() })
  @IsNumber({ allowInfinity: false, allowNaN: false})
  @IsPositive({ groups: CreateType.getAllGroups() })
  @IsDivisibleBy(1000, { groups: CreateType.getAllGroups() })
  @Expose()
  luong: number;

  @Expose({ name: "ho_ten"})
  @IsNotEmpty({ groups: CreateType.getAllGroups() })
  hoTen: string;

  @IsString({ groups: CreateType.getAllGroups() })
  //@Matches(/^\d{9, 11}$/g, { groups: CreateType.getAllGroups() })
  @IsNotEmpty({ groups: CreateType.getAllGroups() })
  @Expose()
  cmnd: string;

  @Expose({ name: "ngay_sinh" })
  @Type(() => Date)
  @IsDate({ groups: CreateType.getAllGroups() })
  ngaySinh: Date;

  @Expose({ name: "gioi_tinh"})
  gioiTinh: string;

  @IsString({ groups: CreateType.getAllGroups() })
  //@Matches(/^(0|\+84\s?)\d{9}$/g, { groups: CreateType.getAllGroups() })
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