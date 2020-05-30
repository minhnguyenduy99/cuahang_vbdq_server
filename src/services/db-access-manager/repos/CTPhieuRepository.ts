import knex from "knex";
import { Result, IDbConnection, SuccessResult, IDatabaseRepoError } from "@core";
import { MapperFactory, CTPhieuMapper } from "@mappers";
import BaseKnexRepository from "../BaseKnexRepository";
import { ICTPhieuRepository, ChiTietPhieu } from "@modules/phieu";

export default class CTPhieuRepository extends BaseKnexRepository<ChiTietPhieu> implements ICTPhieuRepository<any> {

  constructor(connection: IDbConnection<knex>, tableName: string) {
    super(connection, MapperFactory.createMapper(CTPhieuMapper), tableName);
  }
  
  async createListCTPhieu(listCTPhieu: ChiTietPhieu[]): Promise<void> {
    try {
      const persistences = listCTPhieu.map(ctphieu => this.mapper.toPersistenceFormat(ctphieu));
      const knexInstance = this.connection.getConnector();
      await knexInstance.transaction((trx) => {
        return knexInstance(this.tableName).transacting(trx).insert(persistences);
      })
    } catch (err) {
      throw this.knexDatabaseFailed(err);
    }
  }

  async findAllCTPhieu(phieuId: string) {
    try {
      const listCTPhieu = await this.connection.getConnector()
        .select("*").from(this.tableName)
        .where({
          phieu_id: phieuId
        });
      return listCTPhieu.map(ctphieu => this.mapper.toDTOFromPersistence(ctphieu));
    } catch (err) {
      throw this.knexDatabaseFailed(err);
    }
  }

  protected getPersistenceCondition(persistence: any): object {
    return {
      phieu_id: persistence.phieu_id,
      sp_id: persistence.sp_id
    }
  }

  protected getIdCondition(idFields: any[]): object {
    return {
      phieu_id: idFields[0],
      sp_id: idFields[1]
    }
  }
}