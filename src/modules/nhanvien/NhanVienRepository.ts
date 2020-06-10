import Knex from "knex";
import { INhanVienRepository, NhanVien, NhanVienDTO } from "@modules/nhanvien";
import { IDbConnection } from "@core";
import { BaseKnexRepository } from "@services/db-access-manager";
import NhanVienMapper from "./NhanVienMapper";

export default class NhanVienRepository extends BaseKnexRepository<NhanVien> implements INhanVienRepository {

  constructor(connection: IDbConnection<Knex>) {
    super(connection, new NhanVienMapper(), "NHANVIEN");
    this.useRecordMode(true);
  }

  getTongSoLuong(): Promise<number> {
    return this.count();
  }

  async findNhanVienByTaiKhoan(taikhoanId: string): Promise<NhanVienDTO> {
    try {
      let result = await this.connection.getConnector()
        .select("*").from(this.tableName)
        .where("tk_id", "=", taikhoanId)
        .andWhere("record_status", "=", "1")
        .limit(1);
      return result.length === 0 ? null : this.mapper.toDTOFromPersistence(result[0]);
    } catch (err) {
      throw this.knexDatabaseFailed(err);
    }
  }

  findNhanVienByLimit(from: number, count?: number): Promise<NhanVienDTO[]> {
    return this.findLimit(from, count);
  }

  update(nhanvien: NhanVien): Promise<void> {
    return this.persist(nhanvien);
  }

  async getNhanVienByCMND(cmnd: string): Promise<NhanVienDTO> {
    try {
      const nhanvien = await this.connection.getConnector().select("*").from(this.tableName).where({
        cmnd: cmnd
      }).limit(1);
      return this.mapper.toDTOFromPersistence(nhanvien[0]);
    } catch (err) {
      this.knexDatabaseFailed(err);
    }
  }

  async deleteNhanVien(nhanvienId: string) {
    try {
      await this.connection.getConnector()
        .update({ record_status: '0'})
        .table(this.tableName)
        .where(this.getIdCondition([nhanvienId]))
    } catch (err) {
      throw this.knexDatabaseFailed(err);
    }
  }

  async createNhanVien(nhanvien: NhanVien): Promise<void> {
    return this.create(nhanvien);
  }
  
  async getNhanVienById(id: string, findDeleted?: boolean): Promise<NhanVienDTO> {
    try {
      const result = await this.connection.getConnector()
        .select("*").from(this.tableName)
        .where(this.getIdCondition([id]))
        .whereIn("record_status", findDeleted ? ['0', '1'] : ['1'])
        .limit(1);
      return this.mapper.toDTOFromPersistence(result[0]);
    } catch (err) {
      throw this.knexDatabaseFailed(err);
    }
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