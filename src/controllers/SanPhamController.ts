import { RequestHandler } from "express";
import BaseController from "./BaseController";

import { TaoSanPham } from "@modules/usecases";
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
}