import knex from "knex";
import { IKhachHangRepository, KhachHang, KhachHangDTO } from "@modules/khachhang";
import { Result, IDatabaseError, IDbConnection, SuccessResult, FailResult } from "@core";
import KhachHangMapper from "@mappers/KhachHangMapper";
import { KnexDatabaseError } from "../DatabaseError";


export default class KhachHangRepository implements IKhachHangRepository {

  connection: IDbConnection<knex>;
  mapper: KhachHangMapper;
  tableName: string;

  constructor(connection: IDbConnection<knex>) {
    this.connection = connection;
    this.tableName = "KHACHHANG";
    this.mapper = new KhachHangMapper();
  }

  async searchKhachHang(tenKH: string = "", cmnd: string = ""): Promise<Result<KhachHangDTO[], IDatabaseError>> {
    try {
      const searchResult = await this.connection.getConnector()
        .select("*").from(this.tableName)
        .where(`ho_ten`, 'like', `%${tenKH}%`)
        .andWhere('cmnd', 'like', `%${cmnd}%`);
      const khachhangData = searchResult.map(khachhang => this.mapper.toDTOFromPersistence(khachhang));
      return SuccessResult.ok(khachhangData);
    } catch (err) {
      return FailResult.fail(new KnexDatabaseError("KhachHang", err));
    }
  }

  async createKhachHang(khachhang: KhachHang): Promise<Result<void, IDatabaseError>> {
    try {
      const persistence = this.mapper.toPersistenceFormat(khachhang);
      await this.connection.getConnector().insert(persistence).into(this.tableName);
      return SuccessResult.ok(null);
    } catch (err) {
      return FailResult.fail(new KnexDatabaseError("KhachHang", err));
    }
  }

  async findKhachHangById(khachhangId: string): Promise<Result<KhachHangDTO, IDatabaseError>> {
    try {
      const khachHang = await this.connection.getConnector()
        .select("*")
        .from(this.tableName).where({
          id: khachhangId
        })
        .limit(1);
      if (khachHang.length === 0) {
        return SuccessResult.ok(null);
      }
      return SuccessResult.ok(this.mapper.toDTOFromPersistence(khachHang[0]));
    } catch (err) {
      return FailResult.fail(new KnexDatabaseError("KhachHang", err));
    }
  }

  async persist(khachhang: KhachHang): Promise<Result<void, IDatabaseError>> {
    try {
      const persistence = this.mapper.toPersistenceFormat(khachhang);
      await this.connection.getConnector().table(this.tableName).update(persistence).where({
        id: persistence.id
      });
      return SuccessResult.ok(null);
    } catch (err) {
      return FailResult.fail(new KnexDatabaseError("KhachHang", err));
    }
  }

  execute(context: any) {
    throw new Error("Method not implemented.");
  }

}