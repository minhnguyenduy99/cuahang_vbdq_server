import { RequestHandler } from "express";
import { authenticationChecking } from "@middlewares";
import { Dependency, DEPConsts } from "@dep";
import { FOLDERS, IImageLoader } from "@services/image-loader";

import { ISanPhamService } from "@modules/sanpham/shared";
import { TaoSanPham } from "@modules/sanpham/usecases/TaoSanPham";
import { TimKiemSanPham } from "@modules/sanpham/usecases/TimKiemSanPham";

import BaseController from "./BaseController";

export default class SanPhamController extends BaseController {

  private sanphamService: ISanPhamService;
  private imageLoader: IImageLoader;

  constructor(route: string) {
    super(route);
    this.sanphamService = Dependency.Instance.getDomainService(DEPConsts.SanPhamService);
    this.imageLoader = Dependency.Instance.getApplicationSerivce(DEPConsts.ImageLoader);
  }
  
  protected initializeRoutes(): void {
    // this.method("use", authenticationChecking());
    this.method("post", this.createSanPham());
    this.method("get", this.searchSanPham());
  }

  private createSanPham(): RequestHandler {
    return async (req, res, next) => {
      const anh = req.body.anh_dai_dien;
      req.body.anh_dai_dien = null;
      const createSanPhamResult = await this.executeCommand(req.body, new TaoSanPham());
      if (createSanPhamResult.isFailure) {
        return next(createSanPhamResult.error);
      }
      let newSanPham = createSanPhamResult.getValue();
      const source = await this.imageLoader.upload(anh, FOLDERS.SanPham);
      await this.sanphamService.updateAnhSanPham(newSanPham.idsp, source);
      newSanPham.anh_dai_dien = source;
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
      const searchSanPhamResult = await this.executeQuery(parseRequest, new TimKiemSanPham());
      if (searchSanPhamResult.isFailure) {
        return next(searchSanPhamResult.error);
      }
      res.status(200).json(searchSanPhamResult.getValue());
    }
  }
}