import { RequestHandler } from "express";
import BaseController from "./BaseController";

import { TaoSanPham, TimKiemSanPham } from "@modules/usecases";
import { ISanPhamRepository} from "@modules/sanpham";
import { INhaCungCapRepository } from "@modules/nhacungcap"


export default class SanPhamController extends BaseController {
  
  private sanphamRepo: ISanPhamRepository;
  private nhaccRepo: INhaCungCapRepository;

  constructor(sanphamRepo: ISanPhamRepository, nhaccRepo: INhaCungCapRepository, route: string) {
    super(route);
    this.sanphamRepo = sanphamRepo;
    this.nhaccRepo = nhaccRepo;
  }
  
  protected initializeRoutes(): void {
    this.router.post(`${this.route}`, this.createSanPham());
    this.router.get(`${this.route}`, this.searchSanPham());
  }

  private createSanPham(): RequestHandler {
    return async (req, res, next) => {
      const createSanPhamResult = await this.executeCommand(req.body, new TaoSanPham(this.sanphamRepo, this.nhaccRepo));
      if (createSanPhamResult.isFailure) {
        return next(createSanPhamResult.error);
      }
      res.status(201).json(createSanPhamResult.getValue());
    }
  }

  private searchSanPham(): RequestHandler {
    return async (req, res, next) => {
      const { ten_sp, loai_sp, so_luong, from } = req.query;
      const parseRequest = {
        ten_sp: ten_sp,
        loai_sp: loai_sp,
        from: parseInt(from),
        so_luong: parseInt(so_luong)
      }
      const searchSanPhamResult = await this.executeQuery(parseRequest, new TimKiemSanPham(this.sanphamRepo, this.nhaccRepo));
      if (searchSanPhamResult.isFailure) {
        return next(searchSanPhamResult.error);
      }
      res.status(200).json(searchSanPhamResult.getValue());
    }
  }
}