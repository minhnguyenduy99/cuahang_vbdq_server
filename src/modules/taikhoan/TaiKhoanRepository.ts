import Knex from "knex";
import { IDbConnection } from "@core";
import { ITaiKhoanRepository, TaiKhoan, TaiKhoanDTO } from "@modules/taikhoan";
import { BaseKnexRepository } from "@services/db-access-manager";
import TaiKhoanMapper from "./TaiKhoanMapper";


export default class TaiKhoanRepository extends BaseKnexRepository<TaiKhoan> implements ITaiKhoanRepository {

  constructor(connection: IDbConnection<Knex>) {
    super(connection, new TaiKhoanMapper(), "TAIKHOAN");
    this.useRecordMode(true);
  }

  findTaiKhoanByLimit(from: number, count?: number): Promise<TaiKhoanDTO[]> {
    return this.findLimit(from, count);
  }

  updateTaiKhoan(taikhoan: TaiKhoan): Promise<void> {
    return this.persist(taikhoan);
  }

  async deleteTaiKhoan(taikhoanId: string) {
    try {
      let result = await this.connection.getConnector().update({
        record_status: '0'
      }).table(this.tableName).where(this.getIdCondition([taikhoanId]));
      return result === 1;
    }catch(err) {
      throw this.knexDatabaseFailed(err);
    }
  }

  async findTaiKhoan(tenDangNhap: string): Promise<TaiKhoanDTO> {
    try {
      const taikhoan = await this.connection.getConnector().select("*").from(this.tableName).where({
        ten_dang_nhap: tenDangNhap
      }).limit(1);
      return this.mapper.toDTOFromPersistence(taikhoan[0]);
    } catch(err) {
      throw this.knexDatabaseFailed(err);
    }
  }

  async findTaiKhoanById(taikhoanId: string, findDeleted?: boolean): Promise<TaiKhoanDTO> {
    try {
      let result = await this.connection.getConnector()
        .select("*").from(this.tableName)
        .whereIn("record_status", findDeleted ? ['0', '1'] : ['1'])
        .andWhere(this.getIdCondition([taikhoanId])).limit(1);

      return this.mapper.toDTOFromPersistence(result[0]);
    } catch (err) {
      throw this.knexDatabaseFailed(err);
    }
  }

  async taiKhoanExists(tenTaiKhoan: string): Promise<boolean> {
    try {
      const foundTaiKhoans = await this.connection.getConnector().select("id").from(this.tableName).where({
        ten_dang_nhap: tenTaiKhoan
      }).limit(1);
      return foundTaiKhoans.length > 0;
    } catch (err) {
      throw this.knexDatabaseFailed(err);
    }
  }

  async createTaiKhoan(taikhoan: TaiKhoan): Promise<void> {
    return this.create(taikhoan);
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