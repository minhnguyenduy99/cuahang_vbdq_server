import knex from "knex";
import { Result, IDatabaseError, IDbConnection, FailResult, SuccessResult, LimitResult } from "@core";
import { ISanPhamRepository, SanPham, SanPhamDTO } from "@modules/sanpham";
import { MapperFactory, SanPhamMapper } from "@mappers";


import { KnexDatabaseError } from "../DatabaseError";
import BaseKnexRepository from "../BaseKnexRepository";

export default class SanPhamRepository extends BaseKnexRepository<SanPham> implements ISanPhamRepository {

  constructor(connection: IDbConnection<knex>) {
    super(connection, MapperFactory.createMapper(SanPhamMapper), "SANPHAM");
  }

  async searchSanPham(tenSP: string, loaiSP: string, limit: LimitResult)
    : Promise<Result<SanPhamDTO[], IDatabaseError>> {
    try {
      const listSanPhams = await this.connection.getConnector()
        .select("*").from(this.tableName)
        .where('ten', 'like', `%${tenSP}%`)
        .andWhere('loai_sp', 'like', `%${loaiSP}%`)
        .offset(limit.from).limit(limit.count)
        .debug(true);

      const sanphamData = listSanPhams.map(sanpham => this.mapper.toDTOFromPersistence(sanpham));
      return SuccessResult.ok(sanphamData);
    } catch (err) {
      return FailResult.fail(new KnexDatabaseError("SanPham", err));
    }
  }
  
  async createSanPham(sanpham: SanPham): Promise<Result<void, IDatabaseError>> {
    return this.create(sanpham);
  }

  async getSanPhamById(sanphamId: string): Promise<Result<SanPhamDTO, IDatabaseError>> {
    return this.findById( [sanphamId] );
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
