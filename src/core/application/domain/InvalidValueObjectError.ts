import { BaseAppError } from "../core-error";

export default class InvalidValueObjectError extends BaseAppError {

  private valueObjectName: string;

  constructor(module: string, valueObjectName: string, message: string = "Invalid value object") {
    super("Value Object", module, message);
    this.valueObjectName = valueObjectName;
  }

  get valueObject() {
    return this.valueObjectName;
  }
}