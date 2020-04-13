import { ValidatorConstraintInterface, ValidationArguments, ValidatorConstraint } from "class-validator";
import path from "path";

@ValidatorConstraint({ name: "IsImage" })
export default class IsImage implements ValidatorConstraintInterface {
  
  private ALLOW_IMAGE_EXTENSION = [".jpg", ".jpeg", ".png"];

  validate(source: string, validationArguments?: ValidationArguments): boolean  {
    if (source === null) {
      return true; 
    }
    const isValid = this.ALLOW_IMAGE_EXTENSION.indexOf(path.extname(source.toLowerCase())) !== -1;
    return isValid;
  }
  
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return `Allowed type of image ares: ${this.ALLOW_IMAGE_EXTENSION}`;
  }
}