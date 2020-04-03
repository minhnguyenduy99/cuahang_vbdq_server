import { INhaCungCapRepository, NhaCungCap } from "@modules/nhacungcap";
import knex from "knex";
import NhaCungCapMapper from "@mappers/NhaCungCapMapper";
import { IDbConnection, FailResult, SuccessResult } from "@core";
import { KnexDatabaseError } from "../DatabaseError";



export default class NhaCungCapRepository implements INhaCungCapRepository {

  private mapper: NhaCungCapMapper;
  readonly connection: IDbConnection<knex>;
  readonly tableName: string;

  constructor(connection: IDbConnection<knex>) {
    this.mapper = new NhaCungCapMapper();
    this.connection = connection;
    this.tableName = "NHACUNGCAP";
  }

  async nhaCungCapExists(tenNhaCungCap: string) {
    try {
      const result = await this.connection.getConnector().select("id").from(this.tableName).where({
        ten: tenNhaCungCap
      }).limit(1);
      if (result.length === 0) {
        return SuccessResult.ok(false);
      }
      return SuccessResult.ok(true);
    } catch(err) {
      return FailResult.fail(new KnexDatabaseError("NhaCungCap", err));
    }
  }
  
  async createNhaCungCap(nhacungcap: NhaCungCap) {
    try {
      const persistence = this.mapper.toPersistenceFormat(nhacungcap);
      await this.connection.getConnector().insert(persistence).into(this.tableName)
      return SuccessResult.ok(null);
    } catch (err) {
      return FailResult.fail(new KnexDatabaseError("NhaCungCap", err));
    }
  }

  async getNhaCungCapById(id: string) {
    try {
      const persistence = await this.connection.getConnector()
        .select("*")
        .from(this.tableName)
        .where({
          id: id
        });
      return this.mapper.toDTOFromPersistence(persistence[0] || null);
    } catch (err) {
      return FailResult.fail(new KnexDatabaseError("NhaCungCap", err));
    }
  }
}