import { RequestHandler } from "express";
import { BaseController } from "@controllers";
import { UpdateTaiKhoan } from "@modules/taikhoan/usecases/UpdateTaiKhoan";
import { GetTaiKhoanById } from "@modules/taikhoan/usecases/GetTaiKhoanById";
import { FindTaiKhoanPageDTO, FindTaiKhoanPage } from "@modules/taikhoan/usecases/FindTaiKhoanByPage";
import { DeleteTaiKhoan } from "@modules/taikhoan/usecases/DeleteTaiKhoan";
import { Dependency, DEPConsts } from "@dep";
import { SearchTaiKhoanDTO, SearchTaiKhoan } from "@modules/taikhoan/usecases/SearchTaiKhoan";
import { fileHandler, selfAuthorize, authenticationChecking, authorizeUser } from "@middlewares";


export default class TaiKhoanController extends BaseController {
  
  protected initializeRoutes(): void {
    this.method("use", authenticationChecking());
    this.method("use", authorizeUser());
    
    this.methodHandlers("put", "/capnhat/:tk_id", this.updateTaiKhoan(), ...fileHandler("anh_dai_dien"));
    this.method("get", this.searchTaiKhoan(), "/search");
    this.method("get", this.getSoLuong(), "/soluong");
    this.method("get", this.findTaiKhoanByPage(), "/page");
    this.method("get", this.findTaiKhoanById(), "/getbyid/:tk_id");
    this.method("delete", this.deleteTaiKhoan(), "/xoa/:tk_id");
    
    this.methodHandlers("get", "/canhan", this.getTaiKhoanCaNhan());
    this.methodHandlers("put", "/canhan", this.updateTaiKhoanCaNhan(), ...fileHandler("anh_dai_dien"));
  }

  private updateTaiKhoan(): RequestHandler {
    return async (req, res, next) => {
      let request = {
        ...req.body,
        id: req.params.tk_id
      };
      let usecaseResult = await this.executeCommand(request, new UpdateTaiKhoan());
      if (usecaseResult.isFailure) {
        return next(usecaseResult.error);
      }
      return res.status(201).json(usecaseResult.getValue());
    }
  }

  private findTaiKhoanById(): RequestHandler {
    return async (req, res, next) => {
      let usecaseResult = await this.executeQuery(req.params.tk_id, new GetTaiKhoanById());
      if (usecaseResult.isFailure) {
        return next(usecaseResult.error);
      }
      return res.status(201).json(usecaseResult.getValue());
    }
  }

  private findTaiKhoanByPage(): RequestHandler {
    return async (req, res, next) => {
      let limit = {
        from: req.query.from,
        count: req.query.count
      } as FindTaiKhoanPageDTO;
      let usecaseResult = await this.executeQuery(limit, new FindTaiKhoanPage());
      if (usecaseResult.isFailure) {
        return next(usecaseResult.error);
      }
      return res.status(201).json(usecaseResult.getValue());
    }
  }

  private searchTaiKhoan(): RequestHandler {
    return async (req, res, next) => {
      let request = {
        ten_dang_nhap: req.query.ten_dang_nhap,
        from: req.query.from,
        count: req.query.count
      } as SearchTaiKhoanDTO;
      let usecaseResult = await this.executeQuery(request, new SearchTaiKhoan());
      if (usecaseResult.isFailure) {
        return next(usecaseResult.error);
      }
      return res.status(201).json(usecaseResult.getValue());
    }
  }

  private deleteTaiKhoan(): RequestHandler {
    return async (req, res, next) => {
      let usecaseResult = await this.executeCommand(req.params.tk_id, new DeleteTaiKhoan());
      if (usecaseResult.isFailure) {
        return next(usecaseResult.error);
      }
      return res.status(204).json();
    }
  }

  private getSoLuong(): RequestHandler {
    return async (req, res, next) => {
      let taikhoanRepo = Dependency.Instance.getRepository(DEPConsts.TaiKhoanRepository);
      let result = await taikhoanRepo.count();
      return res.status(200).json({
        so_luong: result
      });
    }
  }

  private getTaiKhoanCaNhan(): RequestHandler {
    return async (req, res, next) => {
      let taikhoanId = req.body.authenticate.tk_id;
      let usecaseResult = await this.executeQuery(taikhoanId, new GetTaiKhoanById());
      if (usecaseResult.isFailure) {
        return next(usecaseResult.error);
      }
      return res.status(201).json(usecaseResult.getValue());
    }
  }

  private updateTaiKhoanCaNhan(): RequestHandler {
    return async (req, res, next) => {
      let request = {
        ...req.body,
        id: JSON.parse(req.headers["X-Authenticate"] as string).tk_id
      };
      let usecaseResult = await this.executeCommand(request, new UpdateTaiKhoan());
      if (usecaseResult.isFailure) {
        return next(usecaseResult.error);
      }
      return res.status(201).json(usecaseResult.getValue());
    }
  }
}