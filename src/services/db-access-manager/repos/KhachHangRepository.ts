import knex from "knex";
import { MapperFactory, KhachHangMapper } from "@mappers";
import { IKhachHangRepository, KhachHang, KhachHangDTO } from "@modules/khachhang";
import { Result, IDatabaseError, IDbConnection, SuccessResult, IRepositoryError, IDatabaseRepoError } from "@core";

import BaseKnexRepository from "../BaseKnexRepository";

export default class KhachHangRepository extends BaseKnexRepository<KhachHang> implements IKhachHangRepository {
 
  constructor(connection: IDbConnection<knex>) {
    super(connection, MapperFactory.createMapper(KhachHangMapper), "KHACHHANG");
  }

  update(khachhang: KhachHang): Promise<Result<void, IDatabaseRepoError>> {
    return this.persist(khachhang);
  }

  async searchKhachHang(tenKH: string = "", cmnd: string = ""): Promise<Result<KhachHangDTO[], IDatabaseRepoError>> {
    try {
      const searchResult = await this.connection.getConnector()
        .select("*").from(this.tableName)
        .where(`ho_ten`, 'like', `%${tenKH}%`)
        .andWhere('cmnd', 'like', `%${cmnd}%`);
      const khachhangData = searchResult.map(khachhang => this.mapper.toDTOFromPersistence(khachhang));
      return SuccessResult.ok(khachhangData);
    } catch (err) {
      return this.knexDatabaseFailed(err);
    }
  }

  async createKhachHang(khachhang: KhachHang): Promise<Result<void, IDatabaseRepoError>> {
    return this.create(khachhang);
  }

  async findKhachHangById(khachhangId: string): Promise<Result<KhachHangDTO, IDatabaseRepoError>> {
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