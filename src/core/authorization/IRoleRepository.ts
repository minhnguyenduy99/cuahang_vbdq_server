export default interface IRoleRepository {

  updateRoles(userId: number, roles: string[]): Promise<void>;

  // getRolesOfUser(userId: number): Promise<Result<string[], IRepositoryError>>;
}