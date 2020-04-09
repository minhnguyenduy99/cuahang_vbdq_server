import { RequestHandler } from "express";
import BaseController from "./BaseController";
import {  GetNhanVien, INhanVienRepository, TaoTaiKhoan, TaoNhaCungCap } from "@modules/nhanvien";
import { ITaiKhoanRepository } from "@modules/taikhoan";
import { INhaCungCapRepository } from "@modules/nhacungcap";
import { TimKiemNhaCungCap } from "@modules/usecases";
import { GetNhanVienRequest } from "@modules/usecases";
import { ErrorFactory } from "@services/http-error-handles";
import authenticationChecking from "../middlewares/authentication-check";
import { ImageLoader } from "@services/image-loader";
import { TaiKhoanService, DomainService } from "@modules/services";


export default class NhanVienController extends BaseController {

  private taikhoanService: TaiKhoanService;

  constructor(
    private nhanvienRepo: INhanVienRepository, 
    private taikhoanRepo: ITaiKhoanRepository, 
    private nhaCCRepo: INhaCungCapRepository,
    private imageLoader: ImageLoader,  
    route: string) {
    super(route);
    this.nhanvienRepo = nhanvienRepo;
    this.taikhoanRepo = taikhoanRepo;
    this.nhaCCRepo = nhaCCRepo;
    this.taikhoanService = DomainService.getService(TaiKhoanService, this.taikhoanRepo);
  }
  
  protected initializeRoutes(): void {
    //this.router.use(`${this.route}`, authenticationChecking("tk_id"));
    this.router.get(`${this.route}/:nv_id`, this.getNhanVienById());
    this.router.post(`${this.route}`, this.createNhanVien());
    this.router.post(`${this.route}/nhacungcap`, this.createNhaCungCap());
    this.router.get(`${this.route}/nhacungcap/search`, this.findNhaCungCap());
  }

  private getNhanVienById(): RequestHandler {
    return async (req, res, next) => {
      const request = { 
        nv_id: req.params.nv_id
      } as GetNhanVienRequest;
      const result = await this.executeQuery(request, new GetNhanVien(this.nhanvienRepo));
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
      const result = await this.executeCommand(req.body, new TaoTaiKhoan(this.taikhoanRepo, this.nhanvienRepo));
      if (result.isFailure) {
        return next(result.error);
      }
      let newTaiKhoan = result.getValue();
      const uploadUrl = await this.imageLoader.upload(req.body.anh);
      await this.taikhoanService.updateAnhDaiDien(newTaiKhoan.tk_id, uploadUrl);
      newTaiKhoan.anh_dai_dien = uploadUrl;
      res.status(201).json(result.getValue());
    }
  }

  private createNhaCungCap(): RequestHandler {
    return async (req, res, next) => {
      const usecaseResult = await this.executeCommand(req.body, new TaoNhaCungCap(this.nhaCCRepo));
      if (usecaseResult.isFailure) {
        return next(usecaseResult.error);
      }
      res.status(201).json(usecaseResult.getValue());
    }
  }

  private findNhaCungCap(): RequestHandler {
    return async (req, res, next) => {
      const usecaseResult = await this.executeQuery(req.query, new TimKiemNhaCungCap(this.nhaCCRepo));
      if (usecaseResult.isFailure) {
        return next(usecaseResult.error);
      }
      res.status(200).json(usecaseResult.getValue());
    }
  }
}