import { Router } from "express";

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

  protected abstract initializeRoutes(): void;
}