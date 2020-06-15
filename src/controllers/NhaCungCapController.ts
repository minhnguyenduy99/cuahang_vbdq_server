import BaseController from "./BaseController";
import { RequestHandler } from "express";
import { TaoNhaCungCap } from "@modules/nhacungcap/usecases/TaoNhaCungCap";
import { TimKiemNhaCungCap } from "@modules/nhacungcap/usecases/TimKiemNhaCC";
import { authorizeUser, authenticationChecking, fileHandler } from "@middlewares";
import { Dependency, DEPConsts } from "@dep";


export default class NhaCungCapController extends BaseController {

  protected initializeRoutes(): void {
    this.method("use", authenticationChecking());
    this.method("use", authorizeUser());
    this.methodHandlers("post", "", this.createNhaCungCap(), ...fileHandler("anh_dai_dien"));
    this.method("get", this.findNhaCungCap(), "/search");
    this.method("get", this.getSoLuong(), "/soluong");
  }

  private createNhaCungCap(): RequestHandler {
    return async (req, res, next) => {
      const usecaseResult = await this.executeCommand(req.body, new TaoNhaCungCap());
      if (usecaseResult.isFailure) {
        return next(usecaseResult.error);
      }
      res.status(201).json(usecaseResult.getValue());
    }
  }

  private findNhaCungCap(): RequestHandler {
    return async (req, res, next) => {
      const usecaseResult = await this.executeQuery(req.query, new TimKiemNhaCungCap());
      if (usecaseResult.isFailure) {
        return next(usecaseResult.error);
      }
      res.status(200).json(usecaseResult.getValue());
    }
  }

  private getSoLuong(): RequestHandler {
    return async (req, res, next) => {
      let nhacungcapRepo = Dependency.Instance.getRepository(DEPConsts.NhaCungCapRepository);
      let result = await nhacungcapRepo.count();
      return res.status(200).json({
        so_luong: result
      });
    }
  }
} 