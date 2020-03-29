
import { DatabaseError } from "@core";

export interface DatabaseErrorReference {
  [id: string]: string;
}

const DATABASE_ERROR_KEY: DatabaseErrorReference = {
  "ER_DUP_ENTRY": "Duplicate key error"
}

export class KnexDatabaseError extends DatabaseError {

  public readonly field: string;
  public readonly value: string;

  public constructor(appModule: string, dbInteralError: any) {
    super(appModule || "Unknown", dbInteralError.code, dbInteralError.sqlMessage);
  }

  // private extractFieldAndValue(sqlMessage: string): { field: string, value: string } {
  //   if (!sqlMessage) {
  //     throw new Error("Message cannot be null");
  //   }
  //   const extractStrs = sqlMessage.match(/'\S*'/g).map(val => val.slice(1, val.length - 1));

  //   return {
  //     field: extractStrs[0],
  //     value: extractStrs[1]
  //   }
  // }
}