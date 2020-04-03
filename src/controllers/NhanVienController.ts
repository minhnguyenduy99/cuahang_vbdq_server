import { RequestHandler } from "express";
import BaseController from "./BaseController";
import { ErrorFactory } from "@services/http-error-handles";

import {  GetNhanVien, INhanVienRepository, TaoTaiKhoan, TaoNhaCungCap } from "@modules/nhanvien";
import { ITaiKhoanRepository } from "@modules/taikhoan";
import { INhaCungCapRepository } from "@modules/nhacungcap";


export default class NhanVienController extends BaseController {
  
  private nhanvienRepo: INhanVienRepository;
  private taikhoanRepo: ITaiKhoanRepository;
  private nhaCCRepo: INhaCungCapRepository;

  constructor(nhanvienRepo: INhanVienRepository, taikhoanRepo: ITaiKhoanRepository, nhaCCRepo: INhaCungCapRepository,  route: string) {
    super(route);
    this.nhanvienRepo = nhanvienRepo;
    this.taikhoanRepo = taikhoanRepo;
    this.nhaCCRepo = nhaCCRepo;
  }
  
  protected initializeRoutes(): void {
    this.router.get(`${this.route}/:nv_id`, this.getNhanVienById());
    this.router.post(`${this.route}`, this.createNhanVien());
    this.router.post(`${this.route}/nhacungcap`, this.createNhaCungCap());
  }

  private getNhanVienById(): RequestHandler {
    return async (req, res, next) => {
      const result = await this.executeQuery(req.body, new GetNhanVien(this.nhanvienRepo));
      if (result.isFailure) {
        return next(result.error);
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
}