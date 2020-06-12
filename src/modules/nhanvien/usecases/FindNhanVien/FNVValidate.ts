import { Expose, Transform } from "class-transformer";
import { Validate, IsOptional } from "class-validator";
import { StringToNumber, IsQuantity } from "@modules/helpers";


export default class FNVValidate {

  @Expose({ name: "ten_nv"})
  ten: string;

  @Transform(StringToNumber)
  @Validate(IsQuantity)
  from: number;

  @Transform(StringToNumber)
  @Validate(IsQuantity)
  @IsOptional()
  count: number;
}