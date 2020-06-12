import { IsOptional, validate, Validate } from "class-validator";
import { Transform, plainToClass } from "class-transformer";
import { StringToNumber, IsQuantity } from "@modules/helpers";
import { FailResult, SuccessResult } from "@core";

class FindTaiKhoanPageProps {
  
  @Transform(StringToNumber)
  @Validate(IsQuantity, { message: "From must be natural number"})
  from: number;

  @IsOptional()
  @Transform(StringToNumber)
  count: number;
}

export interface FindTaiKhoanPageDTO {
  from: number;
  count?: number;
}

export async function validateResult(request: FindTaiKhoanPageDTO) {
  let props = plainToClass(FindTaiKhoanPageProps, request);
  let errors = await validate(props, { skipMissingProperties: true });
  if (errors.length > 0) {
    return FailResult.fail(errors);
  }
  return SuccessResult.ok(props as FindTaiKhoanPageDTO);
}