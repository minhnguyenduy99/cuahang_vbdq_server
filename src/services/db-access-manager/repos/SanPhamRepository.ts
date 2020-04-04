import knex from "knex";
import { ISanPhamRepository, SanPham, SanPhamDTO } from "@modules/sanpham";
import SanPhamMapper from "@mappers/SanPhamMapper";
import { Result, IDatabaseError, IDbConnection, FailResult, SuccessResult, LimitResult } from "@core";
import { KnexDatabaseError } from "../DatabaseError";


const MAXIMUM_RESULT_PER_QUERY = 15;

export default class SanPhamRepository implements ISanPhamRepository {

  readonly connection: IDbConnection<knex>;
  private tableName: string;
  private mapper: SanPhamMapper;

  constructor(connection: IDbConnection<knex>) {
    this.connection = connection;
    this.tableName = "SANPHAM";
    this.mapper = new SanPhamMapper();
  }

  public execute(context: knex<any, any[]>) {
    throw new Error("Method not implemented.");
  }

  async searchSanPham(tenSP: string, loaiSP: string, 
    limit: LimitResult = { from: 0, count: MAXIMUM_RESULT_PER_QUERY}): 
    Promise<Result<SanPhamDTO[], IDatabaseError>> {

    try {
      const searchSanPhamProcedure = "SearchSanPham";
      const searchResult = await this.connection.getConnector()
        .raw(`CALL ${searchSanPhamProcedure}(?, ?, ?, ?)`, [tenSP, loaiSP, limit.count, limit.from]);
      const sanphamData = (searchResult[0][0] as Array<any>)
        .map(sanpham => this.mapper.toDTOFromPersistence(sanpham).getValue());
      return SuccessResult.ok(sanphamData);
    } catch (err) {
      return FailResult.fail(new KnexDatabaseError("SanPham", err));
    }
  }
  
  async createSanPham(sanpham: SanPham): Promise<Result<void, IDatabaseError>> {
    try {
      const persistence = this.mapper.toPersistenceFormat(sanpham);
      await this.connection.getConnector().insert(persistence).into(this.tableName);
      return SuccessResult.ok(null);
    } catch (err) {
      return FailResult.fail(new KnexDatabaseError("SanPham", err));
    }
  }

  async getSanPhamById(sanphamId: string): Promise<Result<SanPhamDTO, IDatabaseError>> {
    try {
      const sanPham = await this.connection.getConnector().select("*").from(this.tableName).where({
        id: sanphamId
      }).limit(1);
      return SuccessResult.ok(sanPham[0]);
    } catch (err) {
      return FailResult.fail(new KnexDatabaseError("SanPham", err));
    }
  }
}
