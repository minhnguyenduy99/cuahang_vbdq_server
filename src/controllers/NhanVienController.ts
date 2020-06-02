import { RequestHandler } from "express";
import { Dependency, DEPConsts } from "@dep";
import { ErrorFactory } from "@services/http-error-handles";
import { ImageLoader, FOLDERS } from "@services/image-loader";
import { authenticationChecking } from "@middlewares";

import { GetNhanVien, GetNhanVienRequest } from "@modules/nhanvien/usecases/GetNhanVien";
import { TaoTaiKhoan } from "@modules/nhanvien/usecases/CreateTaiKhoanNhanVien";
import { ITaiKhoanService } from "@modules/taikhoan/shared";

import BaseController from "./BaseController";


export default class NhanVienController extends BaseController {

  private imageLoader: ImageLoader;
  
  private taikhoanService: ITaiKhoanService;

  constructor(route: string) {
    super(route);
    this.imageLoader = Dependency.Instance.getApplicationSerivce(DEPConsts.ImageLoader);
    this.taikhoanService = Dependency.Instance.getDomainService(DEPConsts.TaiKhoanService);
  }
  
  protected initializeRoutes(): void {
    this.method("use", authenticationChecking());
    this.method("get", this.getNhanVienById(), "/:nv_id");
    this.method("post", this.createNhanVien());
  }

  private getNhanVienById(): RequestHandler {
    return async (req, res, next) => {
      const request = { 
        nv_id: req.params.nv_id
      } as GetNhanVienRequest;
      const result = await this.executeQuery(request, new GetNhanVien());
      if (result.isFailure) {
        return next(result.error);
      }
      const data = result.getValue();
      if (!data) {
        return next(ErrorFactory.resourceNotFound());
      }
      res.status(200).json(result.getValue());
    }
  }

  private createNhanVien(): RequestHandler {
    return async (req, res, next) => {
      const anh = req.body.anh_dai_dien;
      req.body.anh_dai_dien = null;
      const result = await this.executeCommand(req.body, new TaoTaiKhoan());
      if (result.isFailure) {
        return next(result.error);
      }
      let newTaiKhoan = result.getValue();
      const uploadUrl = await this.imageLoader.upload(anh, FOLDERS.NhanVien);
      await this.taikhoanService.updateAnhDaiDien(newTaiKhoan.tk_id, uploadUrl);
      newTaiKhoan.anh_dai_dien = uploadUrl;
      res.status(201).json(result.getValue());
    }
  }
}