import fs from "fs";
import path from "path";
import Knex from "knex";
import BaseKnexConnection from "./BaseKnexConnection";

export interface DbConfig {
  host?: string,
  user?: string,
  password?: string,
  database?: string,
  port?: number
}

export default class DbConfigObjectConnection extends BaseKnexConnection {

  private connector: Knex;
  private config: DbConfig;

  name: string;

  constructor(name: string, config: DbConfig) {
    super(name);
    this.config = config;
  }

  async connect(): Promise<boolean> {
    this.connector = Knex({
      client: "mysql",
      connection: this.config
    })
    return true;
  }

  getConnector(): Knex<any, any[]> {
    return this.connector;
  }
}