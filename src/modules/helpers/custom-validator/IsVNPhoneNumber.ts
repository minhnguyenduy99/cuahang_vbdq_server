import { ValidatorConstraintInterface, ValidationArguments, ValidatorConstraint } from "class-validator";

@ValidatorConstraint({ name: "IsVNPhoneNumber" })
export default class IsVNPhoneNumber implements ValidatorConstraintInterface {
  
  validate(value: string, validationArguments?: ValidationArguments): boolean {
    return /^(0|\+84\s?)\d{9}$/g.test(value);
  }
  
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return "Money must be non-negative and divided by 1000";
  }
}