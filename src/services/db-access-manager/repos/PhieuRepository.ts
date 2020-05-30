import knex from "knex";
import { Result, IDbConnection, DatabaseError, LimitResult, IDatabaseRepoError } from "@core";
import BaseKnexRepository from "../BaseKnexRepository";
import { Phieu, IPhieuRepository } from "@modules/phieu";
import KnexDBRepoError from "../KnexDBRepoError";


export default abstract class PhieuRepository<T extends Phieu> extends BaseKnexRepository<T> implements IPhieuRepository<T> {

  constructor(connection: IDbConnection<knex>, tableName: string) {
    super(connection, null, tableName);
    this.setMapper();
  }

  findPhieuById(phieuId: string): Promise<Result<any, IDatabaseRepoError>> {
    return this.findById( [phieuId] );
  }

  async findAllPhieu(limit: LimitResult) {
    try {
      const listCTPhieu = await this.connection.getConnector()
        .select("*").from(this.tableName)
        .offset(limit.from).limit(limit.count);
      return listCTPhieu.map(ctphieu => this.mapper.toDTOFromPersistence(ctphieu))
    } catch (err) {
      throw this.knexDatabaseFailed(err);
    }
  }

  findPhieuByDate(date: Date, limit?: LimitResult): Promise<any[]> {
    return;
  }

  async createPhieu(phieu: T): Promise<void> {
    return this.create(phieu);
  }
  
  async removePhieu(phieuId: string): Promise<void> {
    try {
      const result = await this.connection.getConnector().del().from(this.tableName).where({
        id: phieuId
      });
      if (result === 0) {
        throw new KnexDBRepoError("Phieu", new DatabaseError("Unknown", "Unknown error occurs"));
      }
    } catch (err) {
      throw this.knexDatabaseFailed(err);
    }
  }

  protected getPersistenceCondition(persistence: any): object {
    return {
      id: persistence.id
    }
  }
  protected getIdCondition(idFields: any[]): object {
    return {
      id: idFields[0]
    }
  }

  protected abstract setMapper(): void;
}