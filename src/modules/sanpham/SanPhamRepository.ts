import knex from "knex";
import { IDbConnection, LimitResult } from "@core";
import { ISanPhamRepository, SanPham, SanPhamDTO } from "@modules/sanpham";
import SanPhamMapper from "./SanPhamMapper";
import { BaseKnexRepository } from "@services/db-access-manager";

export default class SanPhamRepository extends BaseKnexRepository<SanPham> implements ISanPhamRepository {

  constructor(connection: IDbConnection<knex>) {
    super(connection, new SanPhamMapper(), "SANPHAM");
    this.useRecordMode(true);
  }

  async getSearchCount(tenSP: string, loaiSP: string): Promise<number> {
    try {
      let result = await this.connection.getConnector()
        .count("*").from(this.tableName)
        .where("ten", "like", `%${tenSP}%`)
        .andWhere("loai_sp", "like", `%${loaiSP}%`)
        .andWhere("record_status", "=", "1").first();
      return result["count(*)"];
    } catch (err) {
      throw this.knexDatabaseFailed(err);
    }
  }

  async getSoLuong() {
    return this.count();
  }

  async getSanPhamByIdNhaCC(nhaccId: string, findDeleted?: boolean): Promise<SanPhamDTO[]> {
    try {
      let datas = await this.connection.getConnector().select("*").from(this.tableName).where({
        id_nhacc: nhaccId,
      }).whereIn("record_status", findDeleted ? ["0", "1"] : ["1"]);
      return datas.map(data => this.mapper.toDTOFromPersistence(data));
    } catch (err) {
      throw this.knexDatabaseFailed(err);
    }
  }

  async searchSanPham(tenSP: string, loaiSP: string, limit: LimitResult): Promise<SanPhamDTO[]> {
    try {
      const listSanPhams = await this.connection.getConnector()
        .select("*").from(this.tableName)
        .where('ten', 'like', `%${tenSP}%`)
        .andWhere('loai_sp', 'like', `%${loaiSP}%`)
        .andWhere('record_status', '=', '1')
        .offset(limit.from).limit(limit.count)

      const sanphamData = listSanPhams.map(sanpham => this.mapper.toDTOFromPersistence(sanpham));
      return sanphamData;
    } catch (err) {
      throw this.knexDatabaseFailed(err);
    }
  }

  async deleteSanPham(sanpham: string | SanPham): Promise<void> {
    try {
      let sanphamId;
      if (sanpham instanceof SanPham) {
        sanphamId = sanpham.getId();
      } else {
        sanphamId = sanpham;
      }
      await this.connection.getConnector().update({
        record_status: '0'
      }).table(this.tableName).where(this.getIdCondition([sanphamId]))
    } catch (err) {
      throw this.knexDatabaseFailed(err);
    }
  }
  
  async createSanPham(sanpham: SanPham): Promise<void> {
    return this.create(sanpham);
  }

  async getSanPhamById(sanphamId: string, findDeleted?: boolean): Promise<SanPhamDTO> {
    try {
      let persistence = await this.connection.getConnector().select("*").from(this.tableName)
        .where("id", "=", sanphamId)
        .whereIn("record_status", findDeleted ? ["0", "1"] : ["1"]).limit(1);
      return this.mapper.toDTOFromPersistence(persistence[0]);
    } catch (err) {
      throw this.knexDatabaseFailed(err);
    }
  }

  protected getPersistenceCondition(persistence: any): object {
    return {
      id: persistence.id,
      record_status: '1'
    }
  }
  
  protected getIdCondition(idFields: any[]): object {
    return {
      id: idFields[0],
      record_status: '1'
    }
  }
}
