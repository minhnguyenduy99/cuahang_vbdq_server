import { BaseKnexRepository } from "@services/db-access-manager";
import { ICTPhieuRepository, ChiTietPhieu } from "@modules/phieu";

export default abstract class CTPhieuRepository extends BaseKnexRepository<ChiTietPhieu<any>> implements ICTPhieuRepository<any> {
  
  async createListCTPhieu(listCTPhieu: ChiTietPhieu<any>[]): Promise<void> {
    try {
      const persistences = listCTPhieu.map(ctphieu => this.mapper.toPersistenceFormat(ctphieu));
      const knexInstance = this.connection.getConnector();
      await knexInstance.transaction((trx) => {
        return knexInstance(this.tableName).transacting(trx).insert(persistences);
      })
    } catch (err) {
      throw this.knexDatabaseFailed(err);
    }
  }

  async findAllCTPhieu(phieuId: string) {
    try {
      const listCTPhieu = await this.connection.getConnector()
        .select("*").from(this.tableName)
        .where({
          phieu_id: phieuId
        });
      return listCTPhieu.map(ctphieu => this.mapper.toDTOFromPersistence(ctphieu));
    } catch (err) {
      throw this.knexDatabaseFailed(err);
    }
  }

  protected abstract getPersistenceCondition(persistence: any): object;
  protected abstract getIdCondition(idFields: any[]): object;
}