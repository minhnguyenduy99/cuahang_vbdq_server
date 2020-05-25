import { RequestHandler } from "express";
import BaseController from "./BaseController";
import { GetNhanVien, TaoTaiKhoan, TaoNhaCungCap } from "@modules/nhanvien";
import { TimKiemNhaCungCap, GetNhanVienRequest } from "@modules/usecases";
import { ErrorFactory } from "@services/http-error-handles";
import { ImageLoader, FOLDERS } from "@services/image-loader";
import authenticationChecking from "../middlewares/authentication-check";
import { INhaCungCapService, ITaiKhoanService } from "@modules/services/Shared";
import { Dependency, DEPConsts } from "@dep";


export default class NhanVienController extends BaseController {

  private imageLoader: ImageLoader;
  private nhacungcapService: INhaCungCapService;
  private taikhoanService: ITaiKhoanService;

  constructor(route: string) {
    super(route);
    this.imageLoader = Dependency.Instance.getApplicationSerivce(DEPConsts.ImageLoader);
    this.nhacungcapService = Dependency.Instance.getDomainService(DEPConsts.NhaCungCapService);
    this.taikhoanService = Dependency.Instance.getDomainService(DEPConsts.TaiKhoanService);
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

  private createNhanVien(): RequestHandler {
    return async (req, res, next) => {
      const anh = req.body.anh_dai_dien;
      req.body.anh_dai_dien = null;
      const result = await this.executeCommand(req.body, new TaoTaiKhoan());
      if (result.isFailure) {
        return next(result.error);
      }
      let newTaiKhoan = result.getValue();
      const uploadUrl = await this.imageLoader.upload(anh, FOLDERS.NhanVien);
      await this.taikhoanService.updateAnhDaiDien(newTaiKhoan.tk_id, uploadUrl);
      newTaiKhoan.anh_dai_dien = uploadUrl;
      res.status(201).json(result.getValue());
    }
  }

  private createNhaCungCap(): RequestHandler {
    return async (req, res, next) => {
      const anh = req.body.anh_dai_dien;
      req.body.anh_dai_dien = null;
      const usecaseResult = await this.executeCommand(req.body, new TaoNhaCungCap());
      if (usecaseResult.isFailure) {
        return next(usecaseResult.error);
      }
      let newNhaCungCap = usecaseResult.getValue();
      const uploadUrl = await this.imageLoader.upload(anh, FOLDERS.NhaCungCap);
      await this.nhacungcapService.updateAnhDaiDien(newNhaCungCap.id, uploadUrl);
      newNhaCungCap.anh_dai_dien = uploadUrl;
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