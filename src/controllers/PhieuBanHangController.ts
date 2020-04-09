import BaseController from "./BaseController";
import { INhanVienRepository } from "@modules/nhanvien";
import { IKhachHangRepository } from "@modules/khachhang";
import { IPhieuBHRepository } from "@modules/phieubanhang";
import { ICTPhieuBHRepository } from "@modules/ctphieubanhang";
import { RequestHandler } from "express";
import { TaoPhieuBanHang } from "@modules/usecases";
import { ISanPhamRepository } from "@modules/sanpham";

export default class PhieuBanHangController extends BaseController {
  
  
  constructor(route: string,
    private nhanvienRepo: INhanVienRepository,
    private khachhangRepo: IKhachHangRepository,
    private phieuMHRepo: IPhieuBHRepository,
    private ctphieuMHRepo: ICTPhieuBHRepository,
    private sanphamRepo: ISanPhamRepository) {

    super(route);
  }
  
  protected initializeRoutes(): void {
    this.router.post(`${this.route}`, this.createPhieu());
  }

  private createPhieu(): RequestHandler {
    return async (req, res, next) => {
      const usecaseResult = await this.executeCommand(req.body, new TaoPhieuBanHang(
        this.phieuMHRepo,
        this.khachhangRepo,
        this.nhanvienRepo,
        this.ctphieuMHRepo,
        this.sanphamRepo));
      if (usecaseResult.isFailure) {
        return next(usecaseResult.error);
      }
      res.status(201).json(usecaseResult.getValue());
    }
  }
}