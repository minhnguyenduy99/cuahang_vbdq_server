import BaseController from "./BaseController";
import { RequestHandler } from "express";
import { authenticationChecking } from "@middlewares";
import { TaoPhieuNhapKho } from "@modules/phieunhapkho/usecases/TaoPhieuNhapkho";
import { GetPhieuNhapKhoById } from "@modules/phieunhapkho/usecases/GetPhieuNhapKhoById";
import { TimKiemPhieuNhapKho, TimKiemPhieuNhapKhoDTO } from "@modules/phieunhapkho/usecases/TimKiemPhieuNhapKho";


export default class PhieuNhapKhoController extends BaseController {
  
  constructor(route: string) {
    super(route);
  }
  
  protected initializeRoutes(): void {
    // this.method("use", authenticationChecking());
    this.method("post", this.createPhieu());
    this.method("get", this.findPhieu());
    this.method("get", this.findPhieuById(), "/:id");
  }

  private createPhieu(): RequestHandler {
    return async (req, res, next) => {
      const usecaseResult = await this.executeCommand(req.body, new TaoPhieuNhapKho());
      if (usecaseResult.isFailure) {
        return next(usecaseResult.error);
      }
      res.status(201).json(usecaseResult.getValue());
    }
  }

  private findPhieuById(): RequestHandler {
    return async (req, res, next) => {
      const result = await this.executeQuery({ phieu_id: req.params.id }, new GetPhieuNhapKhoById());
      if (result.isFailure) {
        return next(result.error);
      }
      res.status(200).json(result.getValue());
    }
  }

  private findPhieu(): RequestHandler {
    return async (req, res, next) => {
      let request = {
        from: Number.parseInt(req.query.from),
        so_luong: Number.parseInt(req.query.so_luong)
      } as TimKiemPhieuNhapKhoDTO;
      const result = await this.executeQuery(request, new TimKiemPhieuNhapKho());
      if (result.isFailure) {
        return next(result.error);
      }
      res.status(200).json(result.getValue());
    }
  }
}