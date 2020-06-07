import BaseController from "./BaseController";
import { RequestHandler } from "express";
import { TaoNhaCungCap } from "@modules/nhacungcap/usecases/TaoNhaCungCap";
import { TimKiemNhaCungCap } from "@modules/nhacungcap/usecases/TimKiemNhaCC";
import { authorizeUser, authenticationChecking } from "@middlewares";


export default class NhaCungCapController extends BaseController {

  protected initializeRoutes(): void {
    this.method("use", authenticationChecking());
    this.method("use", authorizeUser());
    this.method("post", this.createNhaCungCap());
    this.method("get", this.findNhaCungCap(), "/search");
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
} 