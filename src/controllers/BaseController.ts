import { Router } from "express";
import { IUseCase, ICommand, FailResult, SuccessResult, IQuery } from "@core";
import { ErrorFactory } from "@services/http-error-handles";

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
    const commitResult = await command.commit();
    if (commitResult.isFailure) {
      return FailResult.fail(ErrorFactory.databaseError(commitResult.error));
    }
    return SuccessResult.ok(commitResult.getValue());
  }

  protected async executeQuery<T>(request: T, query: IQuery<T>) {
    const executeResult = await query.execute(request);
    if (executeResult.isFailure) {
      return FailResult.fail(ErrorFactory.error(executeResult.error));
    }
    return SuccessResult.ok(executeResult.getValue());
  }

  protected abstract initializeRoutes(): void;
}