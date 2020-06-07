import knex from "knex";
import { IDbConnection, Entity } from "@core";
import { IPersistableRepository } from "@core";
import { IMapper } from "@modules/core";
import { KnexDatabaseError } from "./DatabaseError";
import KnexDBRepoError from "./KnexDBRepoError";

export default abstract class BaseKnexRepository<T extends Entity<any>> implements IPersistableRepository<knex> {

  constructor(
    public readonly connection: IDbConnection<knex>, 
    protected mapper: IMapper<T>,
    protected tableName: string) {
  }

  async persist(model: T): Promise<void> {
    try {
      const persistence = this.mapper.toPersistenceFormat(model);
      await this.connection.getConnector()
        .table(this.tableName)
        .update(persistence)
        .where(this.getPersistenceCondition(persistence)); 
    } catch (err) {
      throw this.knexDatabaseFailed(err);
    }
  }

  async findLimit(from: number, count?: number): Promise<any[]> {
    try {
      let query = this.connection.getConnector()
        .select("*").from(this.tableName)
        .where("record_status", "=", "1")
        .offset(from).limit(count);
      let result = await (count ? query.limit(count) : query);
      return result.map(persistence => this.mapper.toDTOFromPersistence(persistence));
    } catch (err) {
      throw this.knexDatabaseFailed(err);
    }
  }

  async findById(idObject: any = []): Promise<any> {
    try {
      const result = await this.connection.getConnector()
        .select("*").from(this.tableName)
        .where(this.getIdCondition(idObject))
        .limit(1);
      return this.mapper.toDTOFromPersistence(result[0]);
    } catch (err) {
      throw this.knexDatabaseFailed(err);
    }
  }

  async create(entity: T): Promise<void> {
    try {
      const persistence = this.mapper.toPersistenceFormat(entity);
      await this.connection.getConnector().insert(persistence).into(this.tableName);
    } catch (err) {
      throw this.knexDatabaseFailed(err);
    }
  }

  protected knexDatabaseFailed(err: any) {
    return new KnexDBRepoError(this.tableName, new KnexDatabaseError(err));
  }

  protected abstract getPersistenceCondition(persistence: any): object;
  protected abstract getIdCondition(idFields: any[]): object;
}