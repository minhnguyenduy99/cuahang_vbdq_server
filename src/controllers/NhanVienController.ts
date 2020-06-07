import { RequestHandler } from "express";
import { ErrorFactory } from "@services/http-error-handles";
import { authenticationChecking, authorizeUser } from "@middlewares";
import { GetNhanVien, GetNhanVienRequest } from "@modules/nhanvien/usecases/GetNhanVien";
import { TaoTaiKhoan } from "@modules/nhanvien/usecases/CreateTaiKhoanNhanVien";
import BaseController from "./BaseController";
import { UpdateNhanVienDTO, UpdateNhanVien } from "@modules/nhanvien/usecases/UpdateNhanVien";
import { DeleteNhanVien } from "@modules/nhanvien/usecases/DeleteNhanVien";
import { FindNhanVienPage, FindNhanVienPageDTO } from "@modules/nhanvien/usecases/FindNhanVienByPage";


export default class NhanVienController extends BaseController {
  
  protected initializeRoutes(): void {
    this.method("use", authenticationChecking());
    this.method("use", authorizeUser());
    this.method("get", this.findNhanVienByPage(), "/page");
    this.method("get", this.getNhanVienById(), "/:nv_id");
    this.method("post", this.createNhanVien());
    this.method("put", this.updateNhanVien(), "/:nv_id");
    this.method("delete", this.deleteNhanVien(), "/:nv_id");
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

  private findNhanVienByPage(): RequestHandler {
    return async (req, res, next) => {
      const request = {
        count: req.query.count,
        from: req.query.from
      } as FindNhanVienPageDTO;
      const findNhanVien = await this.executeQuery(request, new FindNhanVienPage());
      if (findNhanVien.isFailure) {
        return next(findNhanVien.error);
      }
      return res.status(200).json(findNhanVien.getValue());
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

  private updateNhanVien(): RequestHandler {
    return async (req, res, next) => {
      let request = {
        id: req.params.nv_id,
        ...req.body
      } as UpdateNhanVienDTO;
      const result = await this.executeCommand(request, new UpdateNhanVien());
      if (result.isFailure) {
        return next(result.error);
      }
      res.status(201).json(result.getValue());
    }
  }

  private deleteNhanVien(): RequestHandler {
    return async (req, res, next) => {
      const result = await this.executeCommand(req.params.nv_id, new DeleteNhanVien());
      if (result.isFailure) {
        return next(result.error);
      }
      return res.status(204).json();
    }
  }
}