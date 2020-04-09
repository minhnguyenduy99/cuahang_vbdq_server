import knex from "knex";
import { IPhieuBHRepository, PhieuBanHang } from "@modules/phieubanhang";
import { Result, IDatabaseError, IDbConnection, SuccessResult, FailResult, DatabaseError } from "@core";
import PhieuMuaHangMapper from "@mappers/PhieuMuaHangMapper";
import { KnexDatabaseError } from "../DatabaseError";


export default class PhieuBHRepository implements IPhieuBHRepository {
  readonly connection: IDbConnection<knex>;
  private mapper: PhieuMuaHangMapper;
  private tableName: string;

  constructor(connection: IDbConnection<knex>) {
    this.connection = connection;
    this.mapper = new PhieuMuaHangMapper();
    this.tableName = "PHIEUMUAHANG";
  }

  async createPhieu(phieu: PhieuBanHang): Promise<Result<void, IDatabaseError>> {
    try {
      const persistence = this.mapper.toPersistenceFormat(phieu);
      await this.connection.getConnector().insert(persistence).into(this.tableName);
      return SuccessResult.ok(null);
    } catch (err) {
      return FailResult.fail(new KnexDatabaseError("PhieuMuaHang", err));
    }
  }
  
  async removePhieu(phieuId: string): Promise<Result<void, IDatabaseError>> {
    try {
      const result = await this.connection.getConnector().del().from(this.tableName).where({
        id: phieuId
      });
      return result === 0 ? 
        FailResult.fail(new DatabaseError("UNKNOWN", "Deletion error occurs")) : 
        SuccessResult.ok(null);
    } catch (err) {
      return FailResult.fail(new KnexDatabaseError("PhieuMuaHang", err));
    }
  }
  
  execute(context: any) {
    throw new Error("Method not implemented.");
  }

}