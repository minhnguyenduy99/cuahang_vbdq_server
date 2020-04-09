import { ITaiKhoanRepository, TaiKhoan, TaiKhoanDTO } from "@modules/taikhoan";
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
    this.mapper = new TaiKhoanMapper();
  }

  async persist(taiKhoan: TaiKhoan): Promise<Result<void, IDatabaseError>> {
    try {
      const persistence = this.mapper.toPersistenceFormat(taiKhoan);
      await this.connection.getConnector().table(this.tableName).update(persistence).where({
        id: persistence.id
      });
      return SuccessResult.ok(null);
    } catch (err) {
      return FailResult.fail(new KnexDatabaseError("TaiKhoan", err));
    }
  }
  
  execute(context: any) {
    throw new Error("Method not implemented.");
  }

  async deleteTaiKhoan(taikhoanId: string) {
    try {
      await this.connection.getConnector().table(this.tableName).delete().where({
        id: taikhoanId
      })
      return SuccessResult.ok(null);
    }catch(err) {
      return FailResult.fail(new KnexDatabaseError("TaiKhoan", err));
    }
  }

  async findTaiKhoan(tenDangNhap: string): Promise<Result<TaiKhoanDTO, IDatabaseError>> {
    try {
      const taikhoan = await this.connection.getConnector().select("*").from(this.tableName).where({
        ten_dang_nhap: tenDangNhap
      }).limit(1);
      return this.mapper.toDTOFromPersistence(taikhoan[0]);
    } catch(err) {
      return FailResult.fail(new KnexDatabaseError("TaiKhoan", err));
    }
  }

  async findTaiKhoanById(taikhoanId: string): Promise<Result<TaiKhoanDTO, IDatabaseError>> {
    try {
      const taikhoan = await this.connection.getConnector().select("*").from(this.tableName).where({
        id: taikhoanId
      }).limit(1);
      return this.mapper.toDTOFromPersistence(taikhoan[0]);
    } catch(err) {
      return FailResult.fail(new KnexDatabaseError("TaiKhoan", err));
    }
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
      await this.connection.getConnector().insert(persistenceFormat).into(this.tableName);
      return SuccessResult.ok(null);
    } catch (err) {
      return FailResult.fail(new KnexDatabaseError("TaiKhoan", err));
    }
  }  
}