import Knex from "knex";
import { IDbConnection } from "@core";
import { MapperFactory, TaiKhoanMapper } from "@mappers";
import { ITaiKhoanRepository, TaiKhoan, TaiKhoanDTO } from "@modules/taikhoan";
import BaseKnexRepository from "../BaseKnexRepository";


export default class TaiKhoanRepository extends BaseKnexRepository<TaiKhoan> implements ITaiKhoanRepository {

  constructor(connection: IDbConnection<Knex>) {
    super(connection, MapperFactory.createMapper(TaiKhoanMapper), "TAIKHOAN");
  }

  updateTaiKhoan(taikhoan: TaiKhoan): Promise<void> {
    return this.persist(taikhoan);
  }

  async deleteTaiKhoan(taikhoanId: string) {
    try {
      await this.connection.getConnector().table(this.tableName).delete().where({
        id: taikhoanId
      })
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

  async findTaiKhoanById(taikhoanId: string): Promise<TaiKhoanDTO> {
    return this.findById( [taikhoanId] );
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