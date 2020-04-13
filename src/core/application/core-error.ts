import { Entity } from "./domain";
import { IUseCase } from ".";
import { ClassType } from "class-transformer/ClassTransformer";

export interface IAppError {
  message: string;

  getErrorInfo(): any;
}

export class BaseAppError extends Error implements IAppError {
  readonly domain: string;
  readonly module: string;
  readonly message: string;

  constructor(domain: string, appModule: string, message?: string) {
    super(message);
    this.domain = domain;
    this.module = appModule;
    this.message = message;
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

  constructor(type: string | ClassType<T>, msg?: string) {
    if (typeof type === "string") {
      this.usecase = type;
    } else {
      this.usecase = (type as ClassType<T>).name;
    }
    
    this.message = msg || "Usecase exception";
  }

  getErrorInfo() {
    return {
      usecase: this.usecase,
      message: this.message
    }
  }
}

export class DomainServiceError extends BaseAppError {

  constructor(
    private type: Function, 
    message: string) {
    
    super("DomainService", type.name , message);
  }
}

export class UnknownAppError extends BaseAppError{

  constructor() {
    super("APP_DOMAIN", "Unknown", "Unexpected application error");
  }
}