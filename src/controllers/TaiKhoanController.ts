import { RequestHandler } from "express";
import { BaseController } from "@controllers";
import { UpdateTaiKhoan } from "@modules/taikhoan/usecases/UpdateTaiKhoan";


export default class TaiKhoanController extends BaseController {
  
  constructor(route: string) {
    super(route);
  }
  
  protected initializeRoutes(): void {
    this.method("put", this.updateTaiKhoan(), "/:id");
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

}