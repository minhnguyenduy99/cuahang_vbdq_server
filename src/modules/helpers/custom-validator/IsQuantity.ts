import { ValidatorConstraintInterface, ValidationArguments, IsNumber, Validate, ValidatorConstraint } from "class-validator";

@ValidatorConstraint({ name: "IsQuantity" })
export default class IsQuantity implements ValidatorConstraintInterface {
  
  validate(value: number, validationArguments?: ValidationArguments): boolean {
    const valid = !Number.isNaN(value) && 
      Number.isInteger(value) && 
      Number.isFinite(value) && 
      value >= 0;
    return valid;
  }
  
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return "Quantity must be non-negative integer";
  }
}