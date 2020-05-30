export interface IAppError {
  message?: string;

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

export class UseCaseError implements IAppError {

  message: string;
  code: string;
  obj: any;

  constructor(error: { code: string, message?: string }, argObj?: any) {
    this.code = error.code
    this.message = error.message || "Usecase exception";
    this.obj = argObj;
  }

  getErrorInfo() {
    return {
      code: this.code,
      message: this.message,
      ...this.obj
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

export class InvalidDataError extends DomainServiceError {
  
  protected field: string;

  constructor(field: string, type: Function, message?: string) {
    super(type, message);
    this.field = field;
  }
  
  getErrorInfo() {
    return {
      module: this.module,
      domain: this.domain,
      field: this.field,
      message: this.message
    }
  }
}

export class UnknownAppError extends BaseAppError{

  constructor() {
    super("APP_DOMAIN", "Unknown", "Unexpected application error");
  }
}