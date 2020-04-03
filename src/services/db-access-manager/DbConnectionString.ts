
import Knex from "knex";
import BaseKnexConnection from "./BaseKnexConnection";

export default class DbConnectionString extends BaseKnexConnection {

  private connectionString: string;
  private connector: Knex;
  readonly name: string;

  constructor(name: string, connectionString: string) {
    super(name);
    this.connectionString = connectionString;
  }

  getConnector(): Knex<any, any[]> {
    return this.connector;
  }

  async connect(): Promise<boolean> {
    try {
      this.connector = Knex(this.connectionString);
      return true;
    } catch (err) {
      console.log(`[ConnectionError] ${err}`);
      return false;
    }
  }
}