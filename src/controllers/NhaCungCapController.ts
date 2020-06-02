import BaseController from "./BaseController";
import { RequestHandler } from "express";
import { Dependency, DEPConsts } from "@dep";
import { IImageLoader, FOLDERS } from "@services/image-loader";
import { ErrorFactory } from "@services/http-error-handles";

import { INhaCungCapService } from "@modules/nhacungcap/shared";
import { TaoNhaCungCap } from "@modules/nhacungcap/usecases/TaoNhaCungCap";
import { TimKiemNhaCungCap } from "@modules/nhacungcap/usecases/TimKiemNhaCC";


export default class NhaCungCapController extends BaseController {
  
  private nhacungcapService: INhaCungCapService;
  private imageLoader: IImageLoader;

  constructor(route: string) {
    super(route);
    this.nhacungcapService = Dependency.Instance.getDomainService(DEPConsts.NhaCungCapService);
    this.imageLoader = Dependency.Instance.getApplicationSerivce(DEPConsts.ImageLoader);
  }
  
  protected initializeRoutes(): void {
    this.method("post", this.createNhaCungCap());
    this.method("get", this.findNhaCungCap(), "/search");
  }

  private createNhaCungCap(): RequestHandler {
    return async (req, res, next) => {
      try {
        const anh = req.body.anh_dai_dien;
        req.body.anh_dai_dien = null;
        const usecaseResult = await this.executeCommand(req.body, new TaoNhaCungCap());
        if (usecaseResult.isFailure) {
          return next(usecaseResult.error);
        }
        let newNhaCungCap = usecaseResult.getValue();
        const uploadUrl = await this.imageLoader.upload(anh, FOLDERS.NhaCungCap);
        await this.nhacungcapService.updateAnhDaiDien(newNhaCungCap.id, uploadUrl);
        newNhaCungCap.anh_dai_dien = uploadUrl;
        res.status(201).json(usecaseResult.getValue());
      } catch(err) {
        next(ErrorFactory.error(err));
      }
    }
  }

  private findNhaCungCap(): RequestHandler {
    return async (req, res, next) => {
      const usecaseResult = await this.executeQuery(req.query, new TimKiemNhaCungCap());
      if (usecaseResult.isFailure) {
        return next(usecaseResult.error);
      }
      res.status(200).json(usecaseResult.getValue());
    }
  }

} 