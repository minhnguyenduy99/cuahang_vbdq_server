import { DomainService } from "@core";
import { Dependency, DEPConsts } from "@dep";
import { IAuthorization } from "@services/authorization";
import { ILoaiTaiKhoanRepository } from "@modules/loaitaikhoan/shared";
import ROLES from "./RoleConsts";
import { IRoleService } from "./shared";

export default class RoleService extends DomainService implements IRoleService {
  
  private loaiTKRepo: ILoaiTaiKhoanRepository;
  private authService: IAuthorization;

  constructor(args: any[]) {
    super();
    this.authService = args[0];
    this.loaiTKRepo = Dependency.Instance.getRepository(DEPConsts.LoaiTaiKhoanRepository);
  }

  public async initialize() {
    await Promise.all(ROLES.map((role, index) => {
      return Promise.all([
        // this.loaiTKRepo.createLoaiTaiKhoan(index.toString(), role.role),
        this.authService.addRole(role.role, <any>role.resources)
      ])
    }));
  }

  public async addUserRole(userId: string, loaiTK: number) {
    return this.authService.addUserRole(userId, ROLES[loaiTK].role);
  }

  public async isUserAllowed(userId: string, resource: string) {
    return this.authService.isUserAllowed(userId, resource);
  }
}