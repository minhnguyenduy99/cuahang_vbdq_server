import uniqid from "uniqid";
import { DomainService } from "@core";
import { Dependency, DEPConsts } from "@dep";
import { IAuthorization } from "@services/authorization";
import ROLES from "./RoleConsts";
import { IRoleService, IRoleRepository } from "./shared";
import { ITokenizer } from "@services/tokenizer";


export default class RoleService extends DomainService implements IRoleService {

  private authService: IAuthorization;
  private tokenizer: ITokenizer<any>;

  constructor(args: any[]) {
    super();
    this.authService = args[0];
    this.tokenizer = Dependency.Instance.getApplicationSerivce(DEPConsts.Tokenizer);
  }

  async addVisitor() {
    let visitorId = uniqid();
    let token = await this.tokenizer.sign({ tk_id: visitorId });
    await this.authService.addUserRole(visitorId, ROLES[ROLES.length - 1].role);
    return token;
  }

  public async initialize() {
    await Promise.all(ROLES.map((role, index) => {
      return Promise.all([
        this.authService.addRole(role.role, <any>role.resources)
      ])
    }));
  }

  public async addUserRole(userId: string, loaiTK: string) {
    return this.authService.addUserRole(userId, ROLES[Number.parseInt(loaiTK)].role);
  }

  public async isUserAllowed(userId: string, resource: string, permission: string) {
    return this.authService.isUserAllowed(userId, resource, permission);
  }
}