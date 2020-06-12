import { IsOptional, validate, Validate } from "class-validator";
import { Transform, plainToClass } from "class-transformer";
import { StringToNumber, IsQuantity } from "@modules/helpers";
import { FailResult, SuccessResult } from "@core";

class FindNhanVienPageProps {
  
  @Transform(StringToNumber)
  @Validate(IsQuantity, { message: "From must be natural number"})
  from: number;

  @IsOptional()
  @Transform(StringToNumber)
  count: number;
}

export interface FindNhanVienPageDTO {
  from: number;
  count?: number;
}

export async function validateResult(request: FindNhanVienPageDTO) {
  let props = plainToClass(FindNhanVienPageProps, request);
  let errors = await validate(props, { skipMissingProperties: true });
  if (errors.length > 0) {
    return FailResult.fail(errors);
  }
  return SuccessResult.ok(props as FindNhanVienPageDTO);
}