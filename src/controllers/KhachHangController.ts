import BaseController from "./BaseController";
import { RequestHandler } from "express";
import { Dependency, DEPConsts } from "@dep";
import { IImageLoader, FOLDERS } from "@services/image-loader";
import { ITaiKhoanService } from "@modules/taikhoan/shared";
import { TaoKhachHang, TimKiemKhachHang, TaoTaiKhoanKhachHang, TimKiemKhachHangDTO } from "@modules/khachhang/usecases";
import { authenticationChecking, authorizeUser } from "@middlewares";


export default class KhachHangController extends BaseController {

  private taikhoanService: ITaiKhoanService;
  private imageLoader: IImageLoader;

  constructor(route: string) {
    super(route);
    this.taikhoanService = Dependency.Instance.getDomainService(DEPConsts.TaiKhoanService);
    this.imageLoader = Dependency.Instance.getApplicationSerivce(DEPConsts.ImageLoader);
  }
  
  protected initializeRoutes(): void {
    this.method("use", authenticationChecking());
    this.method("use", authorizeUser());
    this.method("post", this.taoTaiKhoanKhachHang(), "/dangky");
    this.method("get", this.findKhachHang(), "/search");
    this.method("get", this.findKhachHangById(), "/:kh_id");
    this.method("post", this.taoKhachHang());
  }

  private taoKhachHang(): RequestHandler {
    return async (req, res, next) => {
      const taoKhachHangResult = await this.executeCommand(req.body, new TaoKhachHang());
      if (taoKhachHangResult.isFailure) {
        return next(taoKhachHangResult.error);
      }
      res.status(201).json(taoKhachHangResult.getValue());
    }
  }

  private taoTaiKhoanKhachHang(): RequestHandler {
    return async (req, res, next) => {
      let imageFile = req.body.anh_dai_dien;
      req.body.anh_dai_dien = null;
      const taoTaiKhoanKH = await this.executeCommand(req.body, new TaoTaiKhoanKhachHang());
      if (taoTaiKhoanKH.isFailure) {
        return next(taoTaiKhoanKH.error);
      }
      let createdTaiKhoan = taoTaiKhoanKH.getValue();
      let url = await this.imageLoader.upload(imageFile, FOLDERS.KhachHang);
      await this.taikhoanService.updateAnhDaiDien(createdTaiKhoan.id, url);
      createdTaiKhoan.anh_dai_dien = url;
      res.status(201).json(createdTaiKhoan);
    }
  }

  private findKhachHang(): RequestHandler {
    return async (req, res, next) => {
      const request = {
        ten_kh: req.query.ten_kh,
        cmnd: req.query.cmnd
      } as TimKiemKhachHangDTO;
      const timKiemKhachHang = await this.executeQuery(request, new TimKiemKhachHang());
      if (timKiemKhachHang.isFailure) {
        return next(timKiemKhachHang.error);
      }
      return res.status(200).json(timKiemKhachHang.getValue());
    }
  }

  private findKhachHangById(): RequestHandler {
    return async (req, res, next) => {
      const idKH = req.params.kh_id;
      const timKiemKhachHang = await this.executeQuery({ kh_id: idKH }, new TimKiemKhachHang());
      if (timKiemKhachHang.isFailure) {
        return next(timKiemKhachHang.error);
      }
      const khachhang = timKiemKhachHang.getValue();
      return res.status(200).json(khachhang); 
    }
  }
}