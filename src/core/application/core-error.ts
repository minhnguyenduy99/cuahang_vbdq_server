
export interface IAppError {
  domain: string;
  module: string;
  message?: string;
}

export abstract class BaseAppError implements IAppError {
  readonly domain: string;
  readonly module: string;
  readonly message?: string;

  constructor(domain: string, appModule: string, message?: string) {
    this.domain = domain;
    this.module = appModule;
    this.message = `[${this.domain}][${this.module}] ${message}`
  }
}

export class UnknownAppError extends BaseAppError{

  constructor() {
    super("Unknown", "Unknown", "Unexpected application error");
  }
}