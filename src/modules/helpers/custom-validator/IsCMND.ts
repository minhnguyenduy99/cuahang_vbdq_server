import { ValidatorConstraintInterface, ValidationArguments, ValidatorConstraint } from "class-validator";
import path from "path";

@ValidatorConstraint({ name: "IsCMND", async: false})
export default class IsCMND implements ValidatorConstraintInterface {

  validate(cmnd: string, validationArguments?: ValidationArguments): boolean  {
    return /^\d{9,11}$/g.test(cmnd);
  }
  
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return `Số CMND phải từ 9 - 11 chữ số`;
  }
}