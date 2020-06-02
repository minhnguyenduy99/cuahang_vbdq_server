import { IsString } from "class-validator";
import { Expose } from "class-transformer";

export class GetNhanVienDTO {
  
  @IsString()
  @Expose({ name: "nv_id" })
  id: string;
}

export interface GetNhanVienRequest {
  nv_id: string;
}