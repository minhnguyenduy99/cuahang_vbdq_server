import * as core from "@core";
import BaseKnexConnection from "./BaseKnexConnection";
import DBConnectionManager from "./DBConnectionManager";
import { IDatabaseRepository, ApplicationService, IAppSettings, IDbConnection } from "@core";
import DbConfigObjectConnection from "./DbConfigObjectConnection";

interface DbConnectionData {
  name?: string;
  host?: string;
  username?: string;
  password?: string;
  port?: number;
}

export default class DatabaseService extends ApplicationService<DbConnectionData> implements core.IDatabaseService {

  private currentConnection: BaseKnexConnection;

  constructor(appSettings: IAppSettings) {
    super(appSettings);
    const { name, ...connectionData} = this.serviceData;
    this.currentConnection = new DbConfigObjectConnection(name, connectionData);
  }

  getDbConnection(): core.IDbConnection<any> {
    return this.currentConnection;
  }

  public async start() {
    await this.currentConnection.connect();
    console.log("Database service starts successfully");
    return true;
  }

  public async end() {
    this.currentConnection.getConnector().destroy();
  }

  public createRepository<T extends IDatabaseRepository<any>>(
    type: new (connection: BaseKnexConnection, tableName?: string) => T, tableName?: string): T {
    if (!this.currentConnection) {
      throw new Error("The default connection has not been set");
    }
    return new type(this.currentConnection, tableName);
  }

  protected getAppSettings(settings: core.IAppSettings) {
    return settings.getDbConnectionData();
  }
}