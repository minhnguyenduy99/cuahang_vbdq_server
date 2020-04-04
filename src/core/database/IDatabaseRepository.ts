import Entity from "../application/domain/Entity";
import IDbConnection from "./IDbConnection"

export default interface IDatabaseRepository<Context> {
  readonly connection: IDbConnection<Context>;

  execute(context: Context): any;
}