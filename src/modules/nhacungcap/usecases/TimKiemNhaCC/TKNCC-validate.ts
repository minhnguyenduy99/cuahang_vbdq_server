import { IsString, IsNumber, IsInt, IsPositive } from "class-validator";
import { Expose } from "class-transformer";

export interface TimKiemNhaCCDTO {
  ten_nhacc: string;
}

export class TKNCCValidate {

  @IsString()
  @Expose({ name: "ten_nhacc"})
  tenNhaCC: string;
}