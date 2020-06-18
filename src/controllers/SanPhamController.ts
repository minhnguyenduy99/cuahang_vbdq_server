import { RequestHandler } from "express";
import { authenticationChecking, authorizeUser, fileHandler } from "@middlewares";
import { TaoSanPham } from "@modules/sanpham/usecases/TaoSanPham";
import { UpdateSanPham } from "@modules/sanpham/usecases/UpdateSanPham";
import { XoaSanPham } from "@modules/sanpham/usecases/XoaSanPham";

import BaseController from "./BaseController";

export default class SanPhamController extends BaseController {

  constructor(route: string) {
    super(route);
  }
  
  protected initializeRoutes(): void {
    this.method("use", authenticationChecking());
    this.method("use", authorizeUser());
    
    this.methodHandlers("post", "/tao", this.createSanPham(), ...fileHandler("anh_dai_dien"));
    this.method("put", this.updateSanPham(), "/capnhat/:sp_id");
    this.method("delete", this.deleteSanPham(), "/xoa/:sp_id");
  }

  private createSanPham(): RequestHandler {
    return async (req, res, next) => {
      const createSanPhamResult = await this.executeCommand(req.body, new TaoSanPham());
      if (createSanPhamResult.isFailure) {
        return next(createSanPhamResult.error);
      }
      res.status(201).json(createSanPhamResult.getValue());
    }
  }

  private updateSanPham(): RequestHandler {
    return async (req, res, next) => {
      let request = {
        idsp: req.params.sp_id,
        ...req.body
      }
      let result = await this.executeCommand(request, new UpdateSanPham());
      if (result.isFailure) {
        return next(result.error);
      }
      return res.status(200).json(result.getValue());
    }
  }

  private deleteSanPham(): RequestHandler {
    return async (req, res, next) => {
      let result = await this.executeCommand(req.params.sp_id, new XoaSanPham());
      if (result.isFailure) {
        return next(result.error);
      }
      return res.status(200).json(result.getValue());
    }
  }
}