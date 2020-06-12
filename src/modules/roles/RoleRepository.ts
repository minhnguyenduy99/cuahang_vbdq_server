import Knex from "knex";
import { IDbConnection } from "@core";
import { BaseKnexRepository } from "@services/db-access-manager";
import IRoleRepository from "./shared/IRoleRepository";
import RoleMapper from "./RoleMapper";
import Role from "./Role";

export default class RoleRepository extends BaseKnexRepository<Role> implements IRoleRepository {

  constructor(connection: IDbConnection<Knex>) {
    super(connection, new RoleMapper(), "ROLE");
  }

  createRole(role: Role): Promise<void> {
    return this.create(role);
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