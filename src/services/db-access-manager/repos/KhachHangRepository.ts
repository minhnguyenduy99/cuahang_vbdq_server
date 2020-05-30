import knex from "knex";
import { MapperFactory, KhachHangMapper } from "@mappers";
import { IKhachHangRepository, KhachHang, KhachHangDTO } from "@modules/khachhang";
import { Result, IDatabaseError, IDbConnection, SuccessResult, IRepositoryError, IDatabaseRepoError } from "@core";

import BaseKnexRepository from "../BaseKnexRepository";

export default class KhachHangRepository extends BaseKnexRepository<KhachHang> implements IKhachHangRepository {
 
  constructor(connection: IDbConnection<knex>) {
    super(connection, MapperFactory.createMapper(KhachHangMapper), "KHACHHANG");
  }

  async findKhachHangByCMND(cmnd: string): Promise<KhachHangDTO> {
    try {
      let data = await this.connection.getConnector().select('id').from(this.tableName).where({
        cmnd: cmnd
      }).limit(1);
      return this.mapper.toDTOFromPersistence(data);
    } catch (err) {
      throw this.knexDatabaseFailed(err);
    }
  }

  update(khachhang: KhachHang): Promise<void> {
    return this.persist(khachhang);
  }

  async searchKhachHang(tenKH: string = "", cmnd: string = ""): Promise<KhachHangDTO[]> {
    try {
      const searchResult = await this.connection.getConnector()
        .select("*").from(this.tableName)
        .where(`ho_ten`, 'like', `%${tenKH}%`)
        .andWhere('cmnd', 'like', `%${cmnd}%`);
      const khachhangData = searchResult.map(khachhang => this.mapper.toDTOFromPersistence(khachhang));
      return khachhangData;
    } catch (err) {
      throw this.knexDatabaseFailed(err);
    }
  }

  async createKhachHang(khachhang: KhachHang): Promise<void> {
    return this.create(khachhang);
  }

  async findKhachHangById(khachhangId: string): Promise<KhachHangDTO> {
    return this.findById( [khachhangId] );
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