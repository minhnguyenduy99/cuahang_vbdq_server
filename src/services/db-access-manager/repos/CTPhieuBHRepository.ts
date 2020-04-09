import knex from "knex";
import { CTPhieuBanHang, ICTPhieuBHRepository } from "@modules/ctphieubanhang";
import { Result, IDatabaseError, IDbConnection, SuccessResult, FailResult } from "@core";
import CTPhieuMHMapper from "@mappers/CTPhieuMHMapper";
import { KnexDatabaseError } from "../DatabaseError";

export default class CTPhieuMHRepository implements ICTPhieuBHRepository {
  readonly connection: IDbConnection<knex>;
  private tableName: string;
  private mapper: CTPhieuMHMapper;

  constructor(connection: IDbConnection<knex>) {
    this.connection = connection;
    this.tableName = "CTPHIEUMUAHANG";
    this.mapper = new CTPhieuMHMapper();
  }
  
  async createListCTPhieu(listCTPhieu: CTPhieuBanHang[]): Promise<Result<void, IDatabaseError>> {
    try {
      const persistences = listCTPhieu.map(ctphieu => this.mapper.toPersistenceFormat(ctphieu));
      const knexInstance = this.connection.getConnector();
      const result = await knexInstance.transaction((trx) => {
        return knexInstance(this.tableName).transacting(trx).insert(persistences);
      })
      console.log(result);
      return SuccessResult.ok(null);
    } catch (err) {
      return FailResult.fail(new KnexDatabaseError("CTPhieuMuaHang", err));
    }
  }

  execute(context: any) {
    throw new Error("Method not implemented.");
  }

}