import { Router, RequestHandler } from "express";
import { ICommand, FailResult, SuccessResult, IQuery } from "@core";
import { ErrorFactory } from "@services/http-error-handles";

type HTTPMethod = "use" | "get" | "post" | "put" | "delete";

export default abstract class BaseController {

  protected router: Router;
  protected route: string;

  constructor(route: string) {
    this.router = Router();
    this.route = route;

    this.initializeRoutes();
  }

  getRouter(): Router {
    return this.router;
  }

  protected async executeCommand<T>(request: T, command: ICommand<T>) {
    const executeResult = await command.execute(request);
    if (executeResult.isFailure) {
      return FailResult.fail(ErrorFactory.error(executeResult.error));
    }
    const result = await command.commit();
    return SuccessResult.ok(result);
  }

  protected async executeQuery<T>(request: T, query: IQuery<T>) {
    const executeResult = await query.execute(request);
    if (executeResult.isFailure) {
      return FailResult.fail(ErrorFactory.error(executeResult.error));
    }
    return SuccessResult.ok(executeResult.getValue());
  }

  protected method(method: HTTPMethod, handler: RequestHandler, subRoute: string = ""): void {
    this.router[method](`${this.route}${subRoute}`, async (req, res, next) => {
      try {
        await handler(req, res, next);
      } catch (err) {
        next(ErrorFactory.internalServerError());
      }
    }); 
  }

  protected abstract initializeRoutes(): void;
}