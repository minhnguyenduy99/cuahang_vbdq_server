import { ValidatorConstraintInterface, ValidationArguments } from "class-validator";

export default class IsImage implements ValidatorConstraintInterface {
  
  validate(value: number, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
    return value % 1000 === 0 && value >= 0;
  }
  
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return "Money must be non-negative and divided by 1000";
  }
}