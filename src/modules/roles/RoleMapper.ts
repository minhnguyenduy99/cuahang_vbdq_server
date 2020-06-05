import { IMapper } from "@modules/core";
import Role from "./Role";
import RoleDTO from "./shared/RoleDTO";

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
      role: data.role,
      resources: data.resources
    } as RoleDTO;
  }
  
  toPersistenceFormat(Role: Role) {
    const dto = Role.serialize();
    return dto;
  }
}