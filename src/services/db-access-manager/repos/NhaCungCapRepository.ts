import knex from "knex";
import { MapperFactory, NhaCungCapMapper } from "@mappers";
import { IDbConnection, SuccessResult, Result, IDatabaseRepoError } from "@core";
import { INhaCungCapRepository, NhaCungCap, NhaCungCapDTO } from "@modules/nhacungcap";

import BaseKnexRepository from "../BaseKnexRepository";


export default class NhaCungCapRepository extends BaseKnexRepository<NhaCungCap> implements INhaCungCapRepository {

  constructor(connection: IDbConnection<knex>) {
    super(connection, MapperFactory.createMapper(NhaCungCapMapper), "NHACUNGCAP");
  }

  update(nhacungcap: NhaCungCap): Promise<void> {
    return this.persist(nhacungcap);
  }

  async searchNhaCungCap(ten: string): Promise<NhaCungCapDTO[]> {
    try {
      const searchResult = await this.connection.getConnector()
        .select("*").from(this.tableName)
        .where("ten", "like", `%${ten}%`);

      const nhacungcapData = searchResult
        .map(nhaCungCap => this.mapper.toDTOFromPersistence(nhaCungCap));
      return nhacungcapData
    } catch (err) {
      throw this.knexDatabaseFailed(err);
    }
  }

  async nhaCungCapExists(tenNhaCungCap: string) {
    try {
      const result = await this.connection.getConnector().select("id").from(this.tableName).where({
        ten: tenNhaCungCap
      }).limit(1);
      return result.length === 1;
    } catch(err) {
      throw this.knexDatabaseFailed(err);
    }
  }
  
  async createNhaCungCap(nhacungcap: NhaCungCap) {
    try {
      const persistence = this.mapper.toPersistenceFormat(nhacungcap);
      await this.connection.getConnector().insert(persistence).into(this.tableName)
    } catch (err) {
      throw this.knexDatabaseFailed(err);
    }
  }

  async getNhaCungCapById(id: string): Promise<NhaCungCapDTO> {
    return this.findById( [id] );
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
}