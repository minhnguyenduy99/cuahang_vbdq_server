import knex from "knex";
import { Result, IDbConnection, SuccessResult, LimitResult, IDatabaseRepoError } from "@core";
import { ISanPhamRepository, SanPham, SanPhamDTO } from "@modules/sanpham";
import { MapperFactory, SanPhamMapper } from "@mappers";
import BaseKnexRepository from "../BaseKnexRepository";

export default class SanPhamRepository extends BaseKnexRepository<SanPham> implements ISanPhamRepository {

  constructor(connection: IDbConnection<knex>) {
    super(connection, MapperFactory.createMapper(SanPhamMapper), "SANPHAM");
  }

  async searchSanPham(tenSP: string, loaiSP: string, limit: LimitResult)
    : Promise<Result<SanPhamDTO[], IDatabaseRepoError>> {
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
      return this.knexDatabaseFailed(err);
    }
  }
  
  async createSanPham(sanpham: SanPham): Promise<Result<void, IDatabaseRepoError>> {
    return this.create(sanpham);
  }

  async getSanPhamById(sanphamId: string): Promise<Result<SanPhamDTO, IDatabaseRepoError>> {
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
