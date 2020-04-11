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

  async searchSanPham(tenSP: string, loaiSP: string, limit: LimitResult)
    : Promise<Result<SanPhamDTO[], IDatabaseError>> {
    try {
      const listSanPhams = await this.connection.getConnector()
        .select("*").from(this.tableName)
        .where('ten', 'like', `%${tenSP}%`)
        .andWhere('loai_sp', 'like', `%${loaiSP}%`)
        .debug(true);

      const sanphamData = listSanPhams.map(sanpham => this.mapper.toDTOFromPersistence(sanpham));
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
      return SuccessResult.ok(this.mapper.toDTOFromPersistence(sanPham[0]));
    } catch (err) {
      return FailResult.fail(new KnexDatabaseError("SanPham", err));
    }
  }

  async persist(sanpham: SanPham): Promise<Result<void, IDatabaseError>> {
    try {
      const persistence = this.mapper.toPersistenceFormat(sanpham);
      await this.connection.getConnector().table(this.tableName).update(persistence).where({ 
        id: persistence.id
      });
      return SuccessResult.ok(null);
    } catch (err) {
      return FailResult.fail(new KnexDatabaseError("SanPham", err));
    }
  }
}
