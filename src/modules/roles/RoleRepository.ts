import Knex from "knex";
import { IDbConnection } from "@core";
import { IRoleRepository, Role } from "@core-modules/authorization";
import { BaseKnexRepository } from "@services/db-access-manager";
import RoleMapper from "./RoleMapper";



export default class RoleRepository extends BaseKnexRepository<Role> implements IRoleRepository {

  constructor(connection: IDbConnection<Knex>) {
    super(connection, new RoleMapper(), "ROLE");
  }

  async updateRoles(userId: number, roles: string[]) {
    try {
      let rolesStr = roles.reduce(function (pre, cur) {
        if (!pre) return pre
        return pre + ',' + cur
      })
      this.connection.getConnector().table(this.tableName).update({
        roles: rolesStr
      }).where({ id: userId })
    } catch (err) {
      throw this.knexDatabaseFailed(err);
    }
  }

  protected getPersistenceCondition(persistence: any): object {
    return {
      id: persistence.id
    }
  }

  protected getIdCondition(idFields: any[]): object {
    return {
      id: idFields[0]
    }
  }
}