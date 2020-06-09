import { RequestHandler } from "express";
import { BaseController } from "@controllers";
import { UpdateTaiKhoan } from "@modules/taikhoan/usecases/UpdateTaiKhoan";
import { GetTaiKhoanById } from "@modules/taikhoan/usecases/GetTaiKhoanById";
import { FindTaiKhoanPageDTO, FindTaiKhoanPage } from "@modules/taikhoan/usecases/FindTaiKhoanByPage";
import { DeleteTaiKhoan } from "@modules/taikhoan/usecases/DeleteTaiKhoan";


export default class TaiKhoanController extends BaseController {
  
  protected initializeRoutes(): void {
    this.method("put", this.updateTaiKhoan(), "/:id");
    this.method("get", this.findTaiKhoanByPage(), "/page");
    this.method("get", this.findTaiKhoanById(), "/:tk_id");
    this.method("delete", this.deleteTaiKhoan(), "/:tk_id");
  }

  private updateTaiKhoan(): RequestHandler {
    return async (req, res, next) => {
      let request = {
        ...req.body,
        id: req.params.id
      };
      let usecaseResult = await this.executeCommand(request, new UpdateTaiKhoan());
      if (usecaseResult.isFailure) {
        return next(usecaseResult.error);
      }
      return res.status(201).json(usecaseResult.getValue());
    }
  }

  private findTaiKhoanById(): RequestHandler {
    return async (req, res, next) => {
      let usecaseResult = await this.executeQuery(req.params.tk_id, new GetTaiKhoanById());
      if (usecaseResult.isFailure) {
        return next(usecaseResult.error);
      }
      return res.status(201).json(usecaseResult.getValue());
    }
  }

  private findTaiKhoanByPage(): RequestHandler {
    return async (req, res, next) => {
      let limit = {
        from: req.query.from,
        count: req.query.count
      } as FindTaiKhoanPageDTO;
      let usecaseResult = await this.executeQuery(limit, new FindTaiKhoanPage());
      if (usecaseResult.isFailure) {
        return next(usecaseResult.error);
      }
      return res.status(201).json(usecaseResult.getValue());
    }
  }

  private deleteTaiKhoan(): RequestHandler {
    return async (req, res, next) => {
      let usecaseResult = await this.executeCommand(req.params.tk_id, new DeleteTaiKhoan());
      if (usecaseResult.isFailure) {
        return next(usecaseResult.error);
      }
      return res.status(204).json();
    }
  }
}