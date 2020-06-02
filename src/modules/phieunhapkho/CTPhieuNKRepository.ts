import { IDbConnection } from "@core";
import Knex from "knex";
import CTPhieuNhapKhoMapper from "./CTPhieuNhapKhoMapper";
import { CTPhieuRepository } from "@modules/phieu/shared";


export default class CTPhieuNKRepository extends CTPhieuRepository {

  constructor(connection: IDbConnection<Knex>) {
    super(connection, new CTPhieuNhapKhoMapper(), "CTPHIEUNHAPKHO");
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