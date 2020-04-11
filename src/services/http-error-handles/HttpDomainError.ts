import { BaseHttpError } from "./BaseHttpError";
import { DomainServiceError } from "@core";


export default class HttpDomainServiceError extends BaseHttpError {

  constructor(
    private domainError: DomainServiceError, code: number) {
    
    super(domainError.message, code);
    this.name = HttpDomainServiceError.name;
  }

  getErrorInfo() {
    return {
      name: this.name,
      code: this.code,
      domain: this.domainError.domain,
      message: this.message  
    }
  }
}