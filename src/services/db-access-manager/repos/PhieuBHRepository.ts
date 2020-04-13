import knex from "knex";
import PhieuRepository from "./PhieuRepository";
import { PhieuBanHangDTO, PhieuBanHang } from "@modules/phieu/phieubanhang";
import { IDbConnection } from "@core";
import { MapperFactory, PhieuBanHangMapper } from "@mappers";


export default class PhieuBHRepository extends PhieuRepository<PhieuBanHang> {

  constructor(connection: IDbConnection<knex>) {
    super(connection, "PHIEUBANHANG");
  }

  setMapper() {
    this.mapper = MapperFactory.createMapper(PhieuBanHangMapper);
  }
}