import { RequestHandler } from "express";
import { ErrorFactory } from "@services/http-error-handles";
import { authenticationChecking, authorizeUser } from "@middlewares";
import { GetNhanVien, GetNhanVienRequest } from "@modules/nhanvien/usecases/GetNhanVien";
import { TaoTaiKhoan } from "@modules/nhanvien/usecases/CreateTaiKhoanNhanVien";
import BaseController from "./BaseController";


export default class NhanVienController extends BaseController {
  
  protected initializeRoutes(): void {
    this.method("use", authenticationChecking());
    this.method("use", authorizeUser());
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
      const result = await this.executeCommand(req.body, new TaoTaiKhoan());
      if (result.isFailure) {
        return next(result.error);
      }
      res.status(201).json(result.getValue());
    }
  }
}