import { ValidatorConstraintInterface, ValidationArguments } from "class-validator";
import path from "path";

export default class IsImage implements ValidatorConstraintInterface {
  
  private ALLOW_IMAGE_EXTENSION = ["jpg", "jpeg", "png"];

  validate(source: string, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
    return this.ALLOW_IMAGE_EXTENSION.indexOf(path.extname(source.toUpperCase())) !== -1;
  }
  
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return `Allowed type of image ares: ${this.ALLOW_IMAGE_EXTENSION}`;
  }
}