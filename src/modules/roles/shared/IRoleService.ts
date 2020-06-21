

export default interface IRoleService {

  addUserRole(userId: string, loaiTK: string): Promise<void>;

  /**
   * Add a visitor role 
   * 
   * @returns The token for accessing visitor API
   */
  addVisitor(): Promise<string>;

  isUserAllowed(userId: string, resource: string, permission: string): Promise<boolean>;
}