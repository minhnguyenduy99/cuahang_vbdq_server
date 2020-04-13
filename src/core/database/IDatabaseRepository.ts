import IDbConnection from "./IDbConnection"
import { Result, Entity } from "../application";
import { IDatabaseError } from ".";

export default interface IDatabaseRepository<Context> {
  readonly connection: IDbConnection<Context>;

  findById(id: string): Promise<Result<any, IDatabaseError>>;

  create(entity: Entity<any>): Promise<Result<void, IDatabaseError>>;
}