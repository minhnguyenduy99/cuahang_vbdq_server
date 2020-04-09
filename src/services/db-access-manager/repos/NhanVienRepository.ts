import { INhanVienRepository, NhanVien, NhanVienDTO } from "@modules/nhanvien";
import { Result, UniqueEntityID, IDatabaseError, SuccessResult, FailResult, IDbConnection } from "@core";
import BaseKnexConnection from "../BaseKnexConnection";
import NhanVienMapper from "@mappers/NhanVienMapper";
import { KnexDatabaseError } from "../DatabaseError";
import Knex from "knex";


export default class NhanVienRepository implements INhanVienRepository {
  
  readonly connection: BaseKnexConnection;
  private readonly tableName: string;
  private readonly mapper: NhanVienMapper;

  constructor(connection: IDbConnection<Knex>) {
    this.connection = connection as BaseKnexConnection;
    this.tableName = "NHANVIEN";
    this.mapper = new NhanVienMapper();
  }
  
  execute(context: any) {
    throw new Error("Method not implemented.");
  }

  async deleteNhanVien(nhanvienId: string) {
    try {
      await this.connection.getConnector().table(this.tableName).delete().where({
        id: nhanvienId
      })
      return SuccessResult.ok(null);
    } catch (err) {
      return FailResult.fail(new KnexDatabaseError("NhanVien", err));
    }
  }

  async persist(nhanvien: NhanVien): Promise<Result<void, IDatabaseError>> {
    try {
      const persistence = this.mapper.toPersistenceFormat(nhanvien);
      await this.connection.getConnector().table(this.tableName).update(persistence);
      return SuccessResult.ok(null);
    } catch (err) {
      return FailResult.fail(new KnexDatabaseError("NhanVien", err));
    }
  }

  async createNhanVien(nhanvien: NhanVien): Promise<Result<void, IDatabaseError>> {
    try {
      const persistence = this.mapper.toPersistenceFormat(nhanvien);
      await this.connection.getConnector()
        .insert(persistence)
        .into(this.tableName)
      return SuccessResult.ok(null);
    } catch (err) {
      return FailResult.fail(new KnexDatabaseError("NhanVien", err));
    }
  }
  
  async getNhanVienById(id: string): Promise<Result<NhanVienDTO, IDatabaseError>> {
    try {
      const result = await this.connection.getConnector().select("*").from(this.tableName).where({
        id: id
      }).limit(1);
      if (result.length === 0) {
        return SuccessResult.ok(null);
      }
      return this.mapper.toDTOFromPersistence(result[0]);
    } catch (err) {
      return FailResult.fail(new KnexDatabaseError("NhanVien", err));
    }
  }
}