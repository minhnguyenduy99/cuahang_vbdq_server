

export default interface IRoleService {

  addUserRole(userId: string, loaiTK: number): Promise<void>;

  isUserAllowed(userId: string, resource: string): Promise<boolean>;
}