import { IsString, IsNumberString, IsNumber, IsPositive, IsDefined, IsInt, Validate, ValidatorConstraint } from "class-validator";
import { Transform, Expose, Exclude } from "class-transformer";
import { IsQuantity } from "@modules/helpers/custom-validator";

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

  @Validate(IsQuantity)
  from: number;

  @Validate(IsQuantity)
  @Expose({ name: "so_luong" })
  count: number;
}