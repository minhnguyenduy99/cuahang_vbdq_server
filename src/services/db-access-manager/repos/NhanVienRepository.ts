import Knex from "knex";
import { MapperFactory, NhanVienMapper } from "@mappers";
import { INhanVienRepository, NhanVien, NhanVienDTO } from "@modules/nhanvien";
import { IDbConnection } from "@core";

import BaseKnexRepository from "../BaseKnexRepository";

export default class NhanVienRepository extends BaseKnexRepository<NhanVien> implements INhanVienRepository {

  constructor(connection: IDbConnection<Knex>) {
    super(connection, MapperFactory.createMapper(NhanVienMapper), "NHANVIEN");
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
      await this.connection.getConnector().table(this.tableName).delete().where({
        id: nhanvienId
      })
    } catch (err) {
      throw this.knexDatabaseFailed(err);
    }
  }

  async createNhanVien(nhanvien: NhanVien): Promise<void> {
    return this.create(nhanvien);
  }
  
  async getNhanVienById(id: string): Promise<NhanVienDTO> {
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