
import { DatabaseError } from "@core";

export interface DatabaseErrorReference {
  [id: string]: string;
}

const DATABASE_ERROR_KEY: DatabaseErrorReference = {
  "ER_DUP_ENTRY": "Duplicate key error"
}

export class KnexDatabaseError extends DatabaseError {

  readonly name: string;

  public constructor(appModule: string, dbInteralError: any) {
    super("KNEX_DATABASE_ERROR");
    this.name = dbInteralError.code;
  }
}