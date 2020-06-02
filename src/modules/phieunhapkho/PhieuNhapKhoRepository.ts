

import knex from "knex";
import { IDbConnection } from "@core";
import { PhieuRepository } from "@modules/phieu/shared";
import { IPhieuNhapKhoRepository, PhieuNhapKho } from ".";
import PhieuNhapKhoMapper from "./PhieuNhapKhoMapper";


export default class PhieuNhapKhoRepository extends PhieuRepository<PhieuNhapKho> implements IPhieuNhapKhoRepository {

  constructor(connection: IDbConnection<knex>) {
    super(connection, "PHIEUNHAPKHO");
  }

  setMapper() {
    this.mapper = new PhieuNhapKhoMapper(); 
  }
}