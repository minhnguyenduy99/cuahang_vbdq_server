
import { IDatabaseError } from "@core";


export default class DatabaseError implements IDatabaseError {

  readonly type: string;
  readonly message: string;

  constructor(type: string, message?: string) {
    this.type = type;
    this.message = message;
  }


  getErrorInfo() {
    return {
      type: this.type,
      message: this.message
    }
  }
}