import { Entity } from "./domain";
import { IUseCase } from ".";
import { ClassType } from "class-transformer/ClassTransformer";

export interface IAppError {
  message: string;

  getErrorInfo(): any;
}

export abstract class BaseAppError implements IAppError {
  readonly domain: string;
  readonly module: string;
  readonly message: string;

  constructor(domain: string, appModule: string, message?: string) {
    this.domain = domain;
    this.module = appModule;
    this.message = `[${this.domain}][${this.module}] ${message}`
  }

  getErrorInfo() {
    return {
      domain: this.domain,
      module: this.module,
      message: this.message
    }
  }
}

export class InvalidEntity extends BaseAppError {
  
  private readonly entityName: string;

  constructor(module: string, entityName: string, msg?: string) {
    super("APP_DOMAIN", module, msg);
    this.entityName = entityName;
  }
}

export class UseCaseError<T extends IUseCase<any, any>> implements IAppError {

  message: string;
  usecase: string;

  constructor(type: ClassType<T>, msg?: string) {
    this.usecase = type.name;
    this.message = msg || "Usecase exception";
  }

  getErrorInfo() {
    return {
      usecase: this.usecase,
      message: this.message
    }
  }
}

export class UnknownAppError extends BaseAppError{

  constructor() {
    super("APP_DOMAIN", "Unknown", "Unexpected application error");
  }
}