import fs from "fs";
import path from "path";
import Knex from "knex";
import BaseKnexConnection from "./BaseKnexConnection";

export interface ConnectionConfig {
  connectionName: string;
  filePath: {
    isAbsolute: boolean,
    value: string
  }
}

export default class DbConfigObjectConnection extends BaseKnexConnection {

  private connector: Knex;
  private config: ConnectionConfig;

  name: string;

  constructor(name: string, config: ConnectionConfig) {
    super(name);
    this.config = config;
  }

  async connect(): Promise<boolean> {
    const connectionObj = await this.resolveConfigFile(this.config);
    this.connector = Knex({
      client: "mysql",
      connection: connectionObj
    })
    return true;
  }

  getConnector(): Knex<any, any[]> {
    return this.connector;
  }

  protected resolveConfigFile(config: ConnectionConfig): Promise<any> {
    return new Promise((resolve, reject) => {
      const { connectionName, filePath } = config;
      let resultPath = "";
      if (filePath.isAbsolute) {
        resultPath = filePath.value;
      } else {
        resultPath = path.join(__dirname, "../../", filePath.value);
      }
      fs.readFile(resultPath, 'utf-8', (err, data) => {
        if (err) {
          return reject(err);
        } else {
          const connectionObj = (JSON.parse(data))[connectionName];
          resolve(connectionObj);
        }
      })
    })
  }
}