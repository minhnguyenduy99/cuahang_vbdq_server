import BaseController from "./BaseController";
import { RequestHandler } from "express";
import { authenticationChecking } from "@middlewares";
import { TaoPhieuNhapKho } from "@modules/phieunhapkho/usecases/TaoPhieuNhapkho";


export default class PhieuNhapKhoController extends BaseController {
  
  constructor(route: string) {
    super(route);
  }
  
  protected initializeRoutes(): void {
    // this.method("use", authenticationChecking());
    this.method("post", this.createPhieu());
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
}