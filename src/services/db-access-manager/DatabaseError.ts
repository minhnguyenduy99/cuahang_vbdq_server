
import { DatabaseError } from "@core";

export interface DatabaseErrorReference {
  [id: string]: string;
}

const DATABASE_ERROR_KEY: DatabaseErrorReference = {
  "ER_DUP_ENTRY": "Duplicate key error"
}

const UNKNOWN_DATABASE_ERROR_CODE = -4;

export class KnexDatabaseError extends DatabaseError {

  readonly name: string;

  public constructor(dbInteralError: any) {
    super("KNEX_DATABASE_ERROR");
    this.name = dbInteralError.code || UNKNOWN_DATABASE_ERROR_CODE;
  }
}