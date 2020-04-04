// import from core
import IDatabaseRepository from "./IDatabaseRepository";
import IService from "../application/IService";
import IDbConnection from "./IDbConnection";

export default interface IDatabaseService extends IService{

  createRepository<T extends IDatabaseRepository<any>>(
    type: new (connection: IDbConnection<any>) => T) : T;

  addConnection(connection: IDbConnection<any>): void;

  setDefaultConnection(name: string): void;

  destroyConnection(connection: IDbConnection<any>): Promise<boolean>;
}