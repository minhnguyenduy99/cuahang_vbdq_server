import { TaiKhoan } from "@modules/taikhoan";
import { CreateType } from "@modules/core";
import { IAccountAuthenticateService, ITaiKhoanService } from ".";
import { Dependency, DEPConsts } from "@dep";
import AuthenticateResult from "./shared/AuthenticateResult";
import { ITokenizer } from "@services/tokenizer";
import { IAuthorization } from "@services/authorization";
import VertifyResult from "./shared/VertifyResult";

export default class AccountAuthenticateService implements IAccountAuthenticateService {

  private taikhoanService: ITaiKhoanService;
  private tokenizer: ITokenizer<VertifyResult>;
  private authorize: IAuthorization;
  
  constructor() {
    this.taikhoanService = Dependency.Instance.getDomainService(DEPConsts.TaiKhoanService);
    this.tokenizer = Dependency.Instance.getApplicationSerivce(DEPConsts.Tokenizer);
    this.authorize = Dependency.Instance.getApplicationSerivce(DEPConsts.AuthorizationService);
  }

  async isUserAuthenticated(userId: string) {
    let userRoles = await this.authorize.getAllRoles(userId);
    return userRoles.length !== 0;
  }

  async authenticate(tenDangNhap: string, matKhau: string) {
    const getTaiKhoan = await this.taikhoanService.findTaiKhoanByTenDangNhap(tenDangNhap);
    if (getTaiKhoan.isFailure) {
      return {
        valid: false,
        message: "Tên đăng nhập hoặc mật khẩu không chính xác"
      } as AuthenticateResult;
    }
    const taikhoan = getTaiKhoan.getValue();
    const isMatKhauValid = await this.validateMatKhau(taikhoan, matKhau);
    if (!isMatKhauValid) {
      return {
        valid: false,
        message: "Tên đăng nhập hoặc mật khẩu không chính xác"
      } as AuthenticateResult;
    }
    let token = await this.tokenizer.sign({
      tk_id: taikhoan.id,
      loai_tk: taikhoan.loaiTaiKhoan
    })
    return {
      valid: true,
      message: "Đăng nhập thành công",
      token: token,
      data: taikhoan.serialize(CreateType.getGroups().toAppRespone)
    } as AuthenticateResult;
  }

  async vertify(token: string): Promise<VertifyResult> {
    return this.tokenizer.vertify(token);
  }

  private async validateMatKhau(taikhoan: TaiKhoan, matkhau: string) {
    if (!taikhoan) {
      return false;
    } 
    return taikhoan.isMatKhauValid(matkhau);
  }
}