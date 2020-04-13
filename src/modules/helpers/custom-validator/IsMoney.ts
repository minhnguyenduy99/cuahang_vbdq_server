import { ValidatorConstraintInterface, ValidationArguments, ValidatorConstraint } from "class-validator";

@ValidatorConstraint({ name: "IsMoney" })
export default class IsMoney implements ValidatorConstraintInterface {
  
  validate(value: number, validationArguments?: ValidationArguments): boolean {
    return value % 1000 === 0 && value >= 0;
  }
  
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return "Money must be non-negative and divided by 1000";
  }
}