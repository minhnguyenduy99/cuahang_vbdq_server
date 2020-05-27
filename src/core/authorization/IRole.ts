

export interface RoleInfo {
  id: string;
  roleId: number;
}
export interface IRole {
  getIdAndRoleId(): RoleInfo;
}