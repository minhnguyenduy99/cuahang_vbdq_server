import { IMapper } from "@modules/core";
import { Role, RoleDTO } from "@core-modules/authorization";

export default class RoleMapper implements IMapper<Role> {
  
  toDTO(Role: Role) {
    return Role.serialize();
  }

  toDTOFromPersistence(data: any) {
    if (!data) {
      return null;
    }
    return {
      id: data.id,
      name: data.name,
      roles: data.roles
    } as RoleDTO;
  }
  
  toPersistenceFormat(Role: Role) {
    const dto = Role.serialize();
    return dto;
  }
}