import BaseController from "./BaseController";
import { RequestHandler } from "express";
import { TaoPhieuBanHang, GetPhieuBanHangById, GetPhieuBanHang, GetCTPhieuBanHangDTO, GetPhieuBanHangDTO } from "@modules/usecases";
import authenticationChecking from "../middlewares/authentication-check";

export default class PhieuBanHangController extends BaseController {
  
  constructor(route: string) {
    super(route);
  }
  
  protected initializeRoutes(): void {
    // this.method("use", authenticationChecking());
    this.method("post", this.createPhieu());
    this.method("get", this.findPhieuById(), "/:id");
    this.method("get", this.findPhieuBanHang());
  }

  private createPhieu(): RequestHandler {
    return async (req, res, next) => {
      const usecaseResult = await this.executeCommand(req.body, new TaoPhieuBanHang());
      if (usecaseResult.isFailure) {
        return next(usecaseResult.error);
      }
      res.status(201).json(usecaseResult.getValue());
    }
  }

  private findPhieuBanHang(): RequestHandler {
    return async (req, res, next) => {
      const request = {
        so_luong: parseInt(req.query.so_luong),
        from: parseInt(req.query.from)
      } as GetPhieuBanHangDTO;
      const queryResult = await this.executeQuery(request, new GetPhieuBanHang());
      if (queryResult.isFailure) {
        return next(queryResult.error);
      }
      return res.status(200).json(queryResult.getValue());
    }
  }

  private findPhieuById(): RequestHandler {
    return async (req, res, next) => {
      const request = {
        phieu_id: req.params.id
      } as GetCTPhieuBanHangDTO;
      const queryResult = await this.executeQuery(
        request,
        new GetPhieuBanHangById());
      if (queryResult.isFailure) {
        return next(queryResult.error);
      }
      res.status(200).json(queryResult.getValue());
    }
  }
}