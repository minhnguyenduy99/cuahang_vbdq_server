import { INhaCungCapRepository, NhaCungCap, NhaCungCapDTO } from "@modules/nhacungcap";
import knex from "knex";
import NhaCungCapMapper from "@mappers/NhaCungCapMapper";
import { IDbConnection, FailResult, SuccessResult, LimitResult, Result, IDatabaseError } from "@core";
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

  async searchNhaCungCap(ten: string): Promise<Result<NhaCungCapDTO[], IDatabaseError>> {
    try {
      const searchNhaCungCap = "SearchNhaCungCapByName";
      const searchResult = await this.connection.getConnector()
        .raw(`CALL ${searchNhaCungCap}(?)`, [ten]);
      const nhacungcapData = (searchResult[0][0] as Array<any>)
        .map(nhaCungCap => this.mapper.toDTOFromPersistence(nhaCungCap).getValue());
      return SuccessResult.ok(nhacungcapData);
    } catch (err) {
      return FailResult.fail(new KnexDatabaseError("NhaCungCap", err));
    }
  }
  
  execute(context: any) {
    throw new Error("Method not implemented.");
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

  async persist(nhacungcap: NhaCungCap): Promise<Result<void, IDatabaseError>> {
    try {
      const persistence = this.mapper.toPersistenceFormat(nhacungcap);
      await this.connection.getConnector().table(this.tableName).update(persistence).where({
        id: persistence.id
      });
      return SuccessResult.ok(null);
    } catch (err) {
      return FailResult.fail(new KnexDatabaseError("NhaCungCap", err));
    }
  }
}