
import Knex from "knex";
import { IDbConnection } from "@core";
import { BaseKnexRepository }  from "@services/db-access-manager";
import { LoaiTaiKhoan, ILoaiTaiKhoanRepository, LoaiTaiKhoanDTO } from "@modules/loaitaikhoan";
import LoaiTaiKhoanMapper from "./LoaiTaiKhoanMapper";

export default class LoaiTaiKhoanRepository extends BaseKnexRepository<LoaiTaiKhoan> implements ILoaiTaiKhoanRepository {
  
  constructor(connection: IDbConnection<Knex>) {
    super(connection, new LoaiTaiKhoanMapper(), "LOAITAIKHOAN");
  }

  async findLoaiTKKhachHang(): Promise<LoaiTaiKhoanDTO> {
    try {
      let data = await this.connection.getConnector().select("*").from(this.tableName).where({
        ma_ltk: 0
      });
      return this.mapper.toDTOFromPersistence(data[0]);
    } catch (err) {
      throw this.knexDatabaseFailed(err);
    }
  }

  async findLoaiTKNhanVien(): Promise<LoaiTaiKhoanDTO[]> {
    try {
      let datas = await this.connection.getConnector().select("*").from(this.tableName)
        .where("ma_ltk", "<>", 0);
      return datas.map(data => this.mapper.toDTOFromPersistence(data));
    } catch (err) {
      throw this.knexDatabaseFailed(err);
    }
  }

  async findAllLoaiTaiKhoan(): Promise<LoaiTaiKhoanDTO[]> {
    try {
      let datas = await this.connection.getConnector().select("*").from(this.tableName);
      return datas.map(data => this.mapper.toDTOFromPersistence(data));
    } catch (err) {
      throw this.knexDatabaseFailed(err);
    }
  }

  findLTKByMa(maLTK: number): Promise<LoaiTaiKhoanDTO> {
    return this.findById([maLTK]) as Promise<LoaiTaiKhoanDTO>;
  }

  protected getPersistenceCondition(persistence: any): object {
    return {
      ma_ltk: persistence.ma_ltk
    }
  }
  
  protected getIdCondition(idFields: any[]): object {
    return {
      ma_ltk: idFields[0]
    }
  }
}
