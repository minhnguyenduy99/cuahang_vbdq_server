import Allow from "./Allow";

export default interface IAuthorization {

  useAuthorization(use: boolean): void;

  addUserRole(userId: string, role: string): Promise<void>;

  addRole(role: string, allows: (Allow | string)[] | "*"): Promise<void>;

  isUserAllowed(identifier: string, resource: string, permission: string): Promise<boolean>;

  getAllRoles(identifier: string): Promise<string[]>;

  removeUser(identifier: string): Promise<void>;
}