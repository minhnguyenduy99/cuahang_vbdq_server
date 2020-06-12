import Knex from "knex";
import { IDbConnection } from "@core";
import { CTPhieuRepository } from "@modules/phieu/shared";
import CTPhieuBHMapper from "./CTPhieuBHMapper";


export default class CTPhieuBHRepository extends CTPhieuRepository {

  constructor(connection: IDbConnection<Knex>) {
    super(connection, new CTPhieuBHMapper(), "CTPHIEUBANHANG");
  }
  
  protected getPersistenceCondition(persistence: any): object {
    return {
      phieu_id: persistence.phieu_id,
      sp_id: persistence.sp_id
    }
  }
  
  protected getIdCondition(idFields: any[]): object {
    return {
      phieu_id: idFields[0],
      sp_id: idFields[1]
    }
  }
}