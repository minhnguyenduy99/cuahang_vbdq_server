import BaseKnexConnection from "./BaseKnexConnection";


export default class DBConnectionManager {

  private connections: BaseKnexConnection[];

  constructor(connections: BaseKnexConnection[] = []) {
    this.connections = connections;
  }

  getConnection(name: string): BaseKnexConnection {
    return this.connections.find((connection) => connection.name === name);
  }

  addConnection(connection: BaseKnexConnection): void {
    const connectionExists = this.isConnectionExists(connection.name);
    if (connectionExists) {
      throw new Error("This connection name is already exists");
    }
    this.connections.push(connection);
  }

  async removeConnection(connection: BaseKnexConnection): Promise<boolean> {
    const connectionIndex = this.connections.indexOf(connection);
    if (connectionIndex < 0) {
      return false;
    }
    this.connections.splice(connectionIndex, 1);
    return true;
  }

  isConnectionExists(name: string): boolean {
    const connection = this.getConnection(name);
    return connection !== undefined;
  }
}