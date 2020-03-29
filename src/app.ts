// import built-in modules
import express from "express";
import bodyParser from "body-parser";
import session from "express-session";

import { IDatabaseService } from "@core"

// import middlewares


// import custom controllers


const DEFAULT_RELATIVE_CONNECTION_PATH = "/config/db-connection.json";

export default class App {

  private app: express.Application;
  private dbService: IDatabaseService;

  constructor() {
    this.app = express();

    this.initializeDBService();

    this.initializeMiddlewares();
    this.initializeControllers();
    this.initializeErrorHandles();
  }

  listen(host: string, port: number) {
    return this.app.listen(port, host, () => {
      console.log(`The application is listening at ${host}:${port}...`);
    })
  }

  public async startService() {
    // await this.dbService.start();
  }

  public getDBService() {
    return this.dbService;
  }

  protected initializeDBService() {

  }

  protected initializeMiddlewares(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    // this.app.use(cookieParser());
    this.app.use(session({
      secret: "relife_server_secret",
      name: "relife_server"
    }))
  }

  protected initializeControllers(): void {
  }

  protected initializeErrorHandles() {
  }
}
