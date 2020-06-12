import { IsString, Validate, IsOptional } from "class-validator";
import { Expose, Transform } from "class-transformer";
import { IsQuantity, StringToNumber } from "@modules/helpers";

export default class STKValidate {

  @IsString()
  @Expose({ name: "ten_dang_nhap" })
  tenTaiKhoan: string;

  @Validate(IsQuantity)
  @Transform(StringToNumber)
  from: number;

  @Validate(IsQuantity)
  @Transform(StringToNumber)
  @IsOptional()
  count: number;
}