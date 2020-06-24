import { RequestHandler } from "express";
import { Dependency, DEPConsts } from "@dep";
import { ErrorFactory } from "@services/http-error-handles";
import BaseController from "./BaseController";
import { authenticationChecking, authorizeUser, fileHandler, selfAuthorize } from "@middlewares";
import { GetNhanVien, GetNhanVienRequest } from "@modules/nhanvien/usecases/GetNhanVien";
import { TaoTaiKhoan } from "@modules/nhanvien/usecases/CreateTaiKhoanNhanVien";
import { UpdateNhanVienDTO, UpdateNhanVien } from "@modules/nhanvien/usecases/UpdateNhanVien";
import { DeleteNhanVien } from "@modules/nhanvien/usecases/DeleteNhanVien";
import { FindNhanVienPage, FindNhanVienPageDTO } from "@modules/nhanvien/usecases/FindNhanVienByPage";
import { FindNhanVienDTO, FindNhanVien } from "@modules/nhanvien/usecases/FindNhanVien";


export default class NhanVienController extends BaseController {
  
  protected initializeRoutes(): void {
    this.method("use", authenticationChecking());
    this.method("use", authorizeUser());

    this.methodHandlers("post", "/tao", this.createNhanVien(), ...fileHandler("anh_dai_dien"));
    this.method("get", this.getSoLuong(), "/soluong");
    this.method("get", this.searchNhanVien(), "/search");
    this.method("get", this.findNhanVienByPage(), "/page");
    this.method("get", this.getNhanVienById(), "/getbyid/:nv_id");
    this.method("put", this.updateNhanVien(), "/capnhat/:nv_id");
    this.method("delete", this.deleteNhanVien(), "/xoa/:nv_id");
    
    this.methodHandlers("get", "/canhan/", this.getNhanVienCaNhan());
    this.methodHandlers("put", "/canhan/", this.updateNhanVienCaNhan());
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

  private getSoLuong(): RequestHandler {
    return async (req, res, next) => {
      let nhanvienRepo = Dependency.Instance.getRepository(DEPConsts.NhanVienRepository);
      let result = await nhanvienRepo.count();
      return res.status(200).json({
        so_luong: result
      });
    }
  }

  private searchNhanVien(): RequestHandler {
    return async (req, res, next) => {
      let request = {
        ten_nv: req.query.ten_nv,
        from: req.query.from,
        count: req.query.count
      } as FindNhanVienDTO;
      let result = await this.executeQuery(request, new FindNhanVien())
      if (result.isFailure) {
        return next(result.error);
      }
      return res.status(200).json(result.getValue());
    }
  } 

  private getNhanVienCaNhan(): RequestHandler {
    return async (req, res, next) => {
      let nhanvienRepo = Dependency.Instance.getRepository(DEPConsts.NhanVienRepository);
      let taikhoanId = req.body.authenticate.tk_id;
      let nhanvien = await nhanvienRepo.findNhanVienByTaiKhoan(taikhoanId);
      return res.status(200).json(nhanvien);
    }
  }

  private updateNhanVienCaNhan(): RequestHandler {
    return async (req, res, next) => {
      let nhanvienRepo = Dependency.Instance.getRepository(DEPConsts.NhanVienRepository);
      let taikhoanId = req.body.authenticate.tk_id;
      let nhanvien = await nhanvienRepo.findNhanVienByTaiKhoan(taikhoanId);
      if (!nhanvien) {
        return next(ErrorFactory.internalServerError());
      }
      let request = {
        id: nhanvien.id,
        ...req.body
      };
      let nhanvienUpdate = await this.executeCommand(request, new UpdateNhanVien());
      if (nhanvienUpdate.isFailure) {
        return next(nhanvienUpdate.error);
      }
      return res.status(200).json(nhanvienUpdate.getValue());
    }
  } 
}