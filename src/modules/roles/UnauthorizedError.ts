import { IAppError } from "../../core/application";


export default class UnauthorizedError implements IAppError {
  
  readonly message?: string;
  
  constructor(message?: string) {
    this.message = message ?? "Unauthorized";
  }

  getErrorInfo() {
    return {
      message: this.message
    }
  }

}