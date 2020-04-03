import * as core from "@core";
import BaseKnexConnection from "./BaseKnexConnection";
import DBConnectionManager from "./DBConnectionManager";

export default class DatabaseService implements core.IDatabaseService {

  private connectionManager: DBConnectionManager;
  private currentConnection: BaseKnexConnection;

  constructor() {
    this.connectionManager = new DBConnectionManager();
  }

  public async start() {
    await this.currentConnection.connect();
    console.log("Database service starts successfully");
    return true;
  }

  public async end() {
    throw new Error("DatabaseService.end() is not implemented");
  }

  public createRepository<T extends core.IDatabaseRepository>(
    type: new (connection: BaseKnexConnection) => T): T {
    if (!this.currentConnection) {
      throw new Error("The default connection has not been set");
    }
    return new type(this.currentConnection);
  }

  public addConnection(connection: BaseKnexConnection) {
    this.connectionManager.addConnection(connection);
  }

  public destroyConnection(connection: BaseKnexConnection): Promise<boolean> {
    return this.connectionManager.removeConnection(connection);
  }

  public setDefaultConnection(name: string): void {
    const conn = this.connectionManager.getConnection(name);
    if (!conn) {
      throw new Error(`Cannot found the connection with name of ${name}`);
    }
    this.currentConnection = conn;
  }
}