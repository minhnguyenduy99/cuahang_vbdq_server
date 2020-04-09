import { IsString, IsNumberString, IsNumber, IsPositive, IsDefined, IsInt } from "class-validator";
import { Transform, Expose } from "class-transformer";

export interface TimKiemSanPhamDTO {
  ten_sp?: string;
  loai_sp?: string;
  from: number;
  so_luong: number;
}

export class TKSPValidate {

  @IsString()
  @Expose({ name: "ten_sp" })
  tenSP: string;

  @Expose({ name: "loai_sp" })
  loaiSP: string;

  @IsInt()
  @IsNumber()
  from: number;

  @IsInt()
  @IsPositive()
  @Expose({ name: "so_luong" })
  count: number;
}