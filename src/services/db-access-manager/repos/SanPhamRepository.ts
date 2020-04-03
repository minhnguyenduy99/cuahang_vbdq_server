import knex from "knex";
import { ISanPhamRepository, SanPham, SanPhamDTO } from "@modules/sanpham";
import SanPhamMapper from "@mappers/SanPhamMapper";
import { Result, IDatabaseError, IDbConnection, FailResult, SuccessResult } from "@core";
import { KnexDatabaseError } from "../DatabaseError";


export default class SanPhamRepository implements ISanPhamRepository {

  readonly connection: IDbConnection<knex>;
  private tableName: string;
  private mapper: SanPhamMapper;

  constructor(connection: IDbConnection<knex>) {
    this.connection = connection;
    this.mapper = new SanPhamMapper();
    this.tableName = "SANPHAM";
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
