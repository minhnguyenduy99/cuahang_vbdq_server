import { Expose } from "class-transformer";
import { Validate } from "class-validator";
import { IsQuantity } from "@modules/helpers";


export class ValidatedRequest {

  @Expose()
  @Validate(IsQuantity)
  from: number;

  @Expose()
  @Validate(IsQuantity)
  so_luong: number;
}

export interface TimKiemPhieuNhapKhoDTO {
  from: number;
  so_luong: number;
}