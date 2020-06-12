// import from core
import IDatabaseRepository from "./IDatabaseRepository";
import IDbConnection from "./IDbConnection";
import { IApplicationService } from "../application";

export default interface IDatabaseService extends IApplicationService {

  getDbConnection(): IDbConnection<any>;

  createRepository<T extends IDatabaseRepository<any>>(
    type: new (connection: IDbConnection<any>, tableName?: string) => T, tableName?: string) : T;

  start(): Promise<boolean>;
  
  end(): Promise<void>;
}