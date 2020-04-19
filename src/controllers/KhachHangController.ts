import BaseController from "./BaseController";
import { IKhachHangRepository } from "@modules/khachhang";
import { RequestHandler } from "express";
import { TaoKhachHang, TimKiemKhachHang, TimKiemKhachHangDTO } from "@modules/usecases";
import { ErrorFactory } from "@services/http-error-handles";

export default class KhachHangController extends BaseController {
  
  private repo: IKhachHangRepository;

  constructor(repo: IKhachHangRepository, route: string) {
    super(route);
    this.repo = repo;
  }
  
  protected initializeRoutes(): void {
    this.router.get(`${this.route}/search`, this.findKhachHang());
    this.router.get(`${this.route}/:kh_id`, this.findKhachHangById());
    this.router.post(`${this.route}`, this.taoKhachHang());
  }

  private taoKhachHang(): RequestHandler {
    return async (req, res, next) => {
      const taoKhachHangResult = await this.executeCommand(req.body, new TaoKhachHang(this.repo));
      if (taoKhachHangResult.isFailure) {
        return next(taoKhachHangResult.error);
      }
      res.status(201).json(taoKhachHangResult.getValue());
    }
  }

  private findKhachHang(): RequestHandler {
    return async (req, res, next) => {
      const request = {
        ten_kh: req.query.ten_kh,
        cmnd: req.query.cmnd
      } as TimKiemKhachHangDTO;
      const timKiemKhachHang = await this.executeQuery(request, new TimKiemKhachHang(this.repo));
      if (timKiemKhachHang.isFailure) {
        return next(timKiemKhachHang.error);
      }
      return res.status(200).json(timKiemKhachHang.getValue());
    }
  }

  private findKhachHangById(): RequestHandler {
    return async (req, res, next) => {
      const idKH = req.params.kh_id;
      const timKiemKhachHang = await this.executeQuery({ kh_id: idKH }, new TimKiemKhachHang(this.repo));
      if (timKiemKhachHang.isFailure) {
        return next(timKiemKhachHang.error);
      }
      const khachhang = timKiemKhachHang.getValue();
      if (!khachhang) {
        return next(ErrorFactory.resourceNotFound());
      }
      return res.status(200).json(khachhang);
    }
  }
}