import * as core from "@core";
import Knex from "knex";

export default abstract class BaseKnexConnection implements core.IDbConnection<Knex> {
  readonly name: string;
  protected knex: Knex;

  constructor(name: string) {
    this.name = name;
  }

  getConnector(): Knex<any, any[]> {
    return this.knex;
  }

  abstract connect(): Promise<boolean>;
}