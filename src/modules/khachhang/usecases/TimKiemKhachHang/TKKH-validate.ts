import { Expose, Transform } from "class-transformer";
import { IsNumberString,  ValidateIf, Validate, IsOptional } from "class-validator";
import { StringToNumber, IsQuantity } from "@modules/helpers";


export default class TKKHValidate {

  @Expose({ name: "kh_id" })
  id: string;

  @Expose({ name: "ten_kh"})
  ten: string;

  @IsNumberString()
  @ValidateIf((object, val) => val)
  cmnd: string;

  @Transform(StringToNumber)
  @Validate(IsQuantity)
  from: number;

  @Transform(StringToNumber)
  @Validate(IsQuantity)
  @IsOptional()
  count: number;
}