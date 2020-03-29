
import { BaseAppError } from "../application/core-error";
import { IDatabaseError } from "@core";


export default class DatabaseError extends BaseAppError implements IDatabaseError {

  readonly type?: string;

  constructor(appModule?: string, type?: string, message?: string) {
    super("database", appModule || "Unknown module", message);
    this.type = type;
  }
}