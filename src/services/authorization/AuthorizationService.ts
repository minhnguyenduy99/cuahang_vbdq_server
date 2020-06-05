

import IAuthorization from "./IAuthorization";
import { ApplicationService, IAppSettings } from "@core";
import acl from "acl";

let _acl = new acl(new acl.memoryBackend());

export default class AuthorizationService extends ApplicationService<{}> implements IAuthorization {
  
  protected isAuthorizationUsed: boolean = true;

  constructor(settings: IAppSettings) {
    super(settings);
  }

  async removeUser(identifier: string): Promise<void> {
    let userRoles = await this.getAllRoles(identifier);
    return _acl.removeUserRoles(identifier, userRoles);
  }

  getAllRoles(identifier: string): Promise<string[]> {
    return _acl.userRoles(identifier);
  }

  public useAuthorization(use: boolean) {
    this.isAuthorizationUsed = use;
  }

  public async addRole(role: string, allows: string[] | "*") {
    await _acl.allow(role, allows, "*", (err) => {
      if (!err) return
      console.log(err);
    });
  }

  public async addUserRole(userId: string, role: string) {
    await _acl.addUserRoles(userId, role, (err) => {
      if (!err) return
      console.log(err);
    });
  }

  public async isUserAllowed(identifier: string, resource: string) {
    let isAllowed = await _acl.isAllowed(identifier, resource, "*");
    return isAllowed || !this.isAuthorizationUsed;
  }
  
  protected getAppSettings(settings: IAppSettings): {} {
    return {};
  }
}
