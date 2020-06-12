import BaseController from "./BaseController";
import { RequestHandler } from "express";
import { authenticationChecking, authorizeUser } from "@middlewares";

import { TaoKhachHang, TimKiemKhachHang, TaoTaiKhoanKhachHang, TimKiemKhachHangDTO } from "@modules/khachhang/usecases";
import { CapNhatKhachHangDTO, CapNhatKhachHang } from "@modules/khachhang/usecases/CapNhatKhachHang";
import { XoaKhachHang } from "@modules/khachhang/usecases/XoaKhachHang";
import { TimKiemKhachHangPage, TimKiemKhachHangPageDTO } from "@modules/khachhang/usecases/TimKiemKhachHangPage";
import { Dependency, DEPConsts } from "@dep";


export default class KhachHangController extends BaseController {
  
  protected initializeRoutes(): void {
    this.method("use", authenticationChecking());
    this.method("use", authorizeUser());
    this.method("post", this.taoTaiKhoanKhachHang(), "/dangky");
    this.method("get", this.getSoLuong(), "/soluong");
    this.method("get", this.findKhachHang(), "/search");
    this.method("get", this.findKhachHangByPage(), "/page");
    this.method("get", this.findKhachHangById(), "/:kh_id");
    this.method("post", this.taoKhachHang());
    this.method("put", this.updateKhachHang(), "/:kh_id");
    this.method("delete", this.deleteKhachHang(), "/:kh_id");
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
      const taoTaiKhoanKH = await this.executeCommand(req.body, new TaoTaiKhoanKhachHang());
      if (taoTaiKhoanKH.isFailure) {
        return next(taoTaiKhoanKH.error);
      }
      res.status(201).json(taoTaiKhoanKH.getValue());
    }
  }

  private findKhachHang(): RequestHandler {
    return async (req, res, next) => {
      const request = {
        ten_kh: req.query.ten_kh,
        cmnd: req.query.cmnd,
        from: req.query.from,
        count: req.query.count
      } as TimKiemKhachHangDTO;
      const timKiemKhachHang = await this.executeQuery(request, new TimKiemKhachHang());
      if (timKiemKhachHang.isFailure) {
        return next(timKiemKhachHang.error);
      }
      return res.status(200).json(timKiemKhachHang.getValue());
    }
  }

  private findKhachHangByPage(): RequestHandler {
    return async (req, res, next) => {
      const request = {
        count: req.query.count,
        from: req.query.from
      } as TimKiemKhachHangPageDTO;
      const timKiemKhachHang = await this.executeQuery(request, new TimKiemKhachHangPage());
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

  private updateKhachHang(): RequestHandler {
    return async (req, res, next) => {
      let request = {
        id: req.params.kh_id,
        ...req.body
      } as CapNhatKhachHangDTO;
      const updateResult = await this.executeCommand(request, new CapNhatKhachHang());
      if (updateResult.isFailure) {
        return next(updateResult.error);
      }
      return res.status(200).json(updateResult.getValue()); 
    }
  }

  private deleteKhachHang(): RequestHandler {
    return async (req, res, next) => {
      const deleteResult = await this.executeCommand(req.params.kh_id, new XoaKhachHang());
      if (deleteResult.isFailure) {
        return next(deleteResult.error);
      }
      return res.status(204).json(deleteResult.getValue()); 
    }
  }

  private getSoLuong(): RequestHandler {
    return async (req, res, next) => {
      let khachhangRepo = Dependency.Instance.getRepository(DEPConsts.KhachHangRepository);
      let result = await khachhangRepo.count();
      return res.status(200).json({
        so_luong: result
      });
    }
  }
}