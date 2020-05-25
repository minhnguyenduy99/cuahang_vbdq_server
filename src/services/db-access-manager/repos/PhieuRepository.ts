import knex from "knex";
import { Result, IDatabaseError, IDbConnection, SuccessResult, FailResult, DatabaseError, LimitResult, IDatabaseRepoError } from "@core";
import { MapperFactory, PhieuMapper } from "@mappers";
import BaseKnexRepository from "../BaseKnexRepository";
import { Phieu, IPhieuRepository } from "@modules/phieu";
import { PhieuBanHang } from "@modules/phieu/phieubanhang";
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
      return SuccessResult.ok(
        listCTPhieu.map(ctphieu => this.mapper.toDTOFromPersistence(ctphieu))
      );
    } catch (err) {
      return this.knexDatabaseFailed(err);
    }
  }

  findPhieuByDate(date: Date, limit?: LimitResult): Promise<Result<any[], IDatabaseRepoError>> {
    return;
  }

  async createPhieu(phieu: T): Promise<Result<void, IDatabaseRepoError>> {
    return this.create(phieu);
  }
  
  async removePhieu(phieuId: string): Promise<Result<void, IDatabaseRepoError>> {
    try {
      const result = await this.connection.getConnector().del().from(this.tableName).where({
        id: phieuId
      });
      return result === 0 ? 
        FailResult.fail(new KnexDBRepoError("Phieu", new DatabaseError("Unknown", "Unknown error occurs"))) : 
        SuccessResult.ok(null);
    } catch (err) {
      return this.knexDatabaseFailed(err);
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