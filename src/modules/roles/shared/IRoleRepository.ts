import Role from "../Role";

export default interface IRoleRepository {
  createRole(role: Role): Promise<void>;
}