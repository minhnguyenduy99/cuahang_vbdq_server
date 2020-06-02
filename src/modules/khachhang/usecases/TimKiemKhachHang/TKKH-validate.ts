import { Expose } from "class-transformer";
import { IsNumberString,  ValidateIf } from "class-validator";


export default class TKKHValidate {

  @Expose({ name: "kh_id" })
  id: string;

  @Expose({ name: "ten_kh"})
  ten: string;

  @IsNumberString()
  @ValidateIf((object, val) => val)
  cmnd: string;
}