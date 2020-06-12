import knex from "knex";
import { PhieuRepository } from "@modules/phieu/shared";
import { PhieuBanHang, IPhieuBHRepository } from ".";
import { IDbConnection } from "@core";
import PhieuBanHangMapper from "./PhieuBanHangMapper";

export default class PhieuBHRepository extends PhieuRepository<PhieuBanHang> implements IPhieuBHRepository {

  constructor(connection: IDbConnection<knex>) {
    super(connection, "PHIEUBANHANG");
  }

  setMapper() {
    this.mapper = new PhieuBanHangMapper();
  }
}