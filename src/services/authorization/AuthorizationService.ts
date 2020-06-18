

import IAuthorization from "./IAuthorization";
import { ApplicationService, IAppSettings } from "@core";
import acl, { AclSet, AclAllow } from "acl";
import Allow from "./Allow";

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

  public async addRole(role: string, allows: (Allow | string)[] | "*") {
    if (allows === "*") {
      await _acl.allow(role, allows, "*", (err) => {
        if (err) {
          console.log(err)
        }
      })
      return;
    }
    await _acl.allow([{
      roles: role,
      allows: allows.map(allow => {
        return {
          resources: (<Allow>allow).resource ?? allow,
          permissions: (<Allow>allow).permissions ?? ["*"]
        } as AclAllow;
      })
    }])
  }

  public async addUserRole(userId: string, role: string) {
    await _acl.addUserRoles(userId, role, (err) => {
      if (!err) return
      console.log(err);
    });
  }

  public async isUserAllowed(identifier: string, resource: string, permission: string) {
    let isAllowed = await _acl.isAllowed(identifier, resource, permission);
    return isAllowed || !this.isAuthorizationUsed;
  }
  
  protected getAppSettings(settings: IAppSettings): {} {
    return {};
  }
}
