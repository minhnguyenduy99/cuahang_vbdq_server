import BaseController from "./BaseController";
import { INhanVienRepository } from "@modules/nhanvien";
import { IKhachHangRepository } from "@modules/khachhang";
import { RequestHandler } from "express";
import { TaoPhieuBanHang, TimKiemPhieuBHDTO, TimKiemPhieuBanHang, GetPhieuBanHangById, GetPhieuBanHang, GetCTPhieuBanHangDTO, GetPhieuBanHangDTO } from "@modules/usecases";
import { ISanPhamRepository } from "@modules/sanpham";
import { IPhieuRepository, ICTPhieuRepository } from "@modules/phieu";
import authenticationChecking from "../middlewares/authentication-check";

export default class PhieuBanHangController extends BaseController {
  
  
  constructor(route: string,
    private nhanvienRepo: INhanVienRepository,
    private khachhangRepo: IKhachHangRepository,
    private phieuBHRepo: IPhieuRepository<any>,
    private ctphieuBHRepo: ICTPhieuRepository<any>,
    private sanphamRepo: ISanPhamRepository) {

    super(route);
  }
  
  protected initializeRoutes(): void {
    this.router.use(`${this.route}`, authenticationChecking());
    this.router.post(`${this.route}`, this.createPhieu());
    this.router.get(`${this.route}/:id`, this.findPhieuById());
    this.router.get(`${this.route}`, this.findPhieuBanHang());
  }

  private createPhieu(): RequestHandler {
    return async (req, res, next) => {
      const usecaseResult = await this.executeCommand(req.body, new TaoPhieuBanHang(
        this.phieuBHRepo,
        this.khachhangRepo,
        this.nhanvienRepo,
        this.ctphieuBHRepo,
        this.sanphamRepo));
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
      const queryResult = await this.executeQuery(request, new GetPhieuBanHang(this.phieuBHRepo));
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
        new GetPhieuBanHangById(this.phieuBHRepo, this.ctphieuBHRepo, this.sanphamRepo));
      if (queryResult.isFailure) {
        return next(queryResult.error);
      }
      res.status(200).json(queryResult.getValue());
    }
  }
}