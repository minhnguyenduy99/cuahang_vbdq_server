import BaseController from "./BaseController";
import { RequestHandler } from "express";
import { Dependency, DEPConsts } from "@dep";
import { TimKiemSanPham } from "@modules/sanpham/usecases/TimKiemSanPham";
import { IRoleService } from "@modules/roles/shared";
import { IAccountAuthenticateService } from "@modules/taikhoan/shared";
import { ErrorFactory } from "@services/http-error-handles";
import { fileHandler } from "@middlewares";
import { TaoTaiKhoanKhachHang } from "@modules/khachhang/usecases/TaoTaiKhoanKhachHang";


export default class FreeController extends BaseController {
  
  private authenticate: IAccountAuthenticateService;
  private authorization: IRoleService;

  constructor(route: string) {
    super(route);
    this.authenticate = Dependency.Instance.getDomainService(DEPConsts.AccountAuthenticateService);
    this.authorization = Dependency.Instance.getDomainService(DEPConsts.RoleService);
  }

  protected initializeRoutes(): void {
    this.method("post", this.authenticateNhanVien(), "/login");
    this.method("get", this.searchSanPham(), "/sanpham/search");
    this.method("get", this.getSoLuong(), "/sanpham/soluong");
    this.methodHandlers("post", "/khachhang/dangky", this.taoTaiKhoanKhachHang(), ...fileHandler("anh_dai_dien"));
  }

  private authenticateNhanVien(): RequestHandler {
    return async (req, res, next) => {
      let { ten_dang_nhap: username, mat_khau: password } = req.body;
      const result = await this.authenticate.authenticate(username, password);
      if (!result.valid) {
        return next(ErrorFactory.unauthenticated(result.message));
      }
      let { id, loai_tk } = result.data;
      this.authorization.addUserRole(id, loai_tk);
      res.status(200).json(result);
    }
  }

  private taoTaiKhoanKhachHang(): RequestHandler {
    return async (req, res, next) => {
      const taoTaiKhoanKH = await this.executeCommand(req.body, new TaoTaiKhoanKhachHang());
      if (taoTaiKhoanKH.isFailure) {
        return next(taoTaiKhoanKH.error);
      }
      res.status(201).json(taoTaiKhoanKH.getValue());
    }
  }
 
  private searchSanPham(): RequestHandler {
    return async (req, res, next) => {
      const { ten_sp, loai_sp, so_luong, from } = req.query;
      
      const parseRequest = {
        ten_sp: ten_sp,
        loai_sp: loai_sp,
        from: parseInt(from),
        so_luong: parseInt(so_luong)
      }
      const searchSanPhamResult = await this.executeQuery(parseRequest, new TimKiemSanPham());
      if (searchSanPhamResult.isFailure) {
        return next(searchSanPhamResult.error);
      }
      res.status(200).json(searchSanPhamResult.getValue());
    }
  }

  private getSoLuong(): RequestHandler {
    return async (req, res, next) => {
      let sanphamRepo = Dependency.Instance.getRepository(DEPConsts.SanPhamRepository);
      let result = await sanphamRepo.count();
      return res.status(200).json({
        so_luong: result
      });
    }
  }
}