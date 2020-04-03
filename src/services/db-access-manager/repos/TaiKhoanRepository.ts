import { ITaiKhoanRepository, TaiKhoan } from "@modules/taikhoan";
import { Result, IDatabaseError, IDbConnection, FailResult, SuccessResult } from "@core";
import Knex from "knex";
import TaiKhoanMapper from "@mappers/TaiKhoanMapper";
import { KnexDatabaseError } from "../DatabaseError";


export default class TaiKhoanRepository implements ITaiKhoanRepository {
  
  readonly connection: IDbConnection<Knex>;
  private tableName: string;
  private mapper: TaiKhoanMapper;
  
  constructor(connection: IDbConnection<Knex>) {
    this.connection = connection;
    this.tableName = "TAIKHOAN";
    this.mapper = new TaiKhoanMapper()
  }

  async taiKhoanExists(tenTaiKhoan: string): Promise<Result<boolean, IDatabaseError>> {
    try {
      const foundTaiKhoans = await this.connection.getConnector().select("id").from(this.tableName).where({
        ten_dang_nhap: tenTaiKhoan
      }).limit(1);
      return SuccessResult.ok(foundTaiKhoans.length > 0);
    } catch (err) {
      return FailResult.fail(new KnexDatabaseError("TaiKhoan", err));
    }
  }

  async createTaiKhoan(taikhoan: TaiKhoan): Promise<Result<void, IDatabaseError>> {
    const persistenceFormat = this.mapper.toPersistenceFormat(taikhoan);
    try {
      await this.connection.getConnector().insert(persistenceFormat)
      return SuccessResult.ok(null);
    } catch (err) {
      return FailResult.fail(new KnexDatabaseError("TaiKhoan", err));
    }
  }  
}