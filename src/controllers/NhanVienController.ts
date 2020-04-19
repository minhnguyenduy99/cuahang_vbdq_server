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
import { TaiKhoanService, NhaCungCapService } from "@modules/services/DomainService";
import { DomainService, ApplicationService } from "@core";


export default class NhanVienController extends BaseController {

  private taikhoanService: TaiKhoanService;
  private nhacungcapService: NhaCungCapService;
  private imageLoader: ImageLoader;

  constructor( 
    private nhanvienRepo: INhanVienRepository,
    private taikhoanRepo: ITaiKhoanRepository, 
    private nhaCCRepo: INhaCungCapRepository,
    route: string) {
      
    super(route);
    this.taikhoanService = DomainService.getService(TaiKhoanService, this.taikhoanRepo);
    this.nhacungcapService = DomainService.getService(NhaCungCapService, this.nhaCCRepo);
    this.imageLoader = ApplicationService.getService(ImageLoader);
  }
  
  protected initializeRoutes(): void {
    this.router.use(`${this.route}`, authenticationChecking());
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
      const anh = req.body.anh_dai_dien;
      req.body.anh_dai_dien = null;
      const result = await this.executeCommand(req.body, new TaoTaiKhoan(this.taikhoanRepo, this.nhanvienRepo));
      if (result.isFailure) {
        return next(result.error);
      }
      let newTaiKhoan = result.getValue();
      const uploadUrl = await this.imageLoader.upload(anh);
      await this.taikhoanService.updateAnhDaiDien(newTaiKhoan.tk_id, uploadUrl);
      newTaiKhoan.anh_dai_dien = uploadUrl;
      res.status(201).json(result.getValue());
    }
  }

  private createNhaCungCap(): RequestHandler {
    return async (req, res, next) => {
      const anh = req.body.anh_dai_dien;
      req.body.anh_dai_dien = null;
      const usecaseResult = await this.executeCommand(req.body, new TaoNhaCungCap(this.nhaCCRepo));
      if (usecaseResult.isFailure) {
        return next(usecaseResult.error);
      }
      let newNhaCungCap = usecaseResult.getValue();
      const uploadUrl = await this.imageLoader.upload(anh);
      await this.nhacungcapService.updateAnhDaiDien(newNhaCungCap.id, uploadUrl);
      newNhaCungCap.anh_dai_dien = uploadUrl;
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