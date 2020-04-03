import uniqid from "uniqid";
import { Expose, Type, Transform } from "class-transformer";
import { IsIn, IsNumber, IsPositive, IsDivisibleBy, ValidateIf, IsString, IsOptional } from "class-validator";
import CreateType from "../entity-create-type";

export default class NhanVienProps {

  @IsString()
  @IsOptional({ groups: [CreateType.getGroups().createNew] })
  @Transform((val) => uniqid(), { groups: [CreateType.getGroups().createNew] })
  id: string;
  
  @IsString()
  @IsOptional({ groups: [CreateType.getGroups().createNew] })
  idql: string;

  @Expose({ name: "chuc_vu"})
  @IsIn(["NHANVIEN", "KHACHHANG"])
  chucvu: string;

  @IsOptional({ groups: [CreateType.getGroups().createNew] })
  @IsNumber({ allowInfinity: false, allowNaN: false})
  @IsPositive()
  @IsDivisibleBy(1000)
  luong: number;

  @Expose({ name: "ho_ten"})
  hoTen: string;

  @IsString()
  @ValidateIf((val) => /^\d{9, 11}$/.test(val))
  cmnd: string;

  @Expose({ name: "ngay_sinh" })
  @Type(() => Date)
  ngaySinh: Date;

  @Expose({ name: "gioi_tinh"})
  gioiTinh: string;

  @IsString()
  @ValidateIf((val) => /^(0|\+84\s?)\d{9}$/.test(val))
  sdt: string;

  @IsOptional({ groups: [CreateType.getGroups().createNew] })
  @IsString()
  @Expose({ name: "dia_chi" })
  diachi: string;

  @IsOptional({ groups: [CreateType.getGroups().createNew] })
  @IsString()
  @Expose({ name: "ghi_chu" })
  ghichu: string;

  @Expose({ name: "taikhoan_id" })
  taiKhoanId: string;
}