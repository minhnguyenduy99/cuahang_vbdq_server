import Entity from "../application/domain/Entity";
import IDbConnection from "./IDbConnection"

export default interface IDatabaseRepository {
  readonly connection: IDbConnection<any>;
}