
export default interface IAuthorization {

  useAuthorization(use: boolean): void;

  addUserRole(userId: string, role: string): Promise<void>;

  addRole(role: string, allows: string[] | "*"): Promise<void>;

  isUserAllowed(identifier: string, resource: string): Promise<boolean>;

  getAllRoles(identifier: string): Promise<string[]>;

  removeUser(identifier: string): Promise<void>;
}