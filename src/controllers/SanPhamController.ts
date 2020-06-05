import { RequestHandler } from "express";
import { authenticationChecking, authorizeUser } from "@middlewares";
import { Dependency, DEPConsts } from "@dep";
import { FOLDERS, IImageLoader } from "@services/image-loader";

import { ISanPhamService } from "@modules/sanpham/shared";
import { TaoSanPham } from "@modules/sanpham/usecases/TaoSanPham";
import { TimKiemSanPham } from "@modules/sanpham/usecases/TimKiemSanPham";
import { UpdateSanPham } from "@modules/sanpham/usecases/UpdateSanPham";
import { XoaSanPham } from "@modules/sanpham/usecases/XoaSanPham";

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
    this.method("use", authenticationChecking());
    this.method("use", authorizeUser());
    this.method("post", this.createSanPham());
    this.method("get", this.searchSanPham());
    this.method("put", this.updateSanPham(), "/:sp_id");
    this.method("delete", this.deleteSanPham(), "/:sp_id");
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

  private updateSanPham(): RequestHandler {
    return async (req, res, next) => {
      let request = {
        idsp: req.params.sp_id,
        ...req.body
      }
      let result = await this.executeCommand(request, new UpdateSanPham());
      if (result.isFailure) {
        return next(result.error);
      }
      return res.status(200).json(result.getValue());
    }
  }

  private deleteSanPham(): RequestHandler {
    return async (req, res, next) => {
      let result = await this.executeCommand(req.params.sp_id, new XoaSanPham());
      if (result.isFailure) {
        return next(result.error);
      }
      return res.status(200).json(result.getValue());
    }
  }
}