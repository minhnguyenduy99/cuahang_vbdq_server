// import built-in modules
import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import "reflect-metadata";

import { IDatabaseService } from "@core"

// import middlewares
import HttpException from "./middlewares/http-exception";

// import custom controllers
import NhanVienController from "./controllers/NhanVienController";
import SanPhamController from "./controllers/SanPhamController";

// import services
import { DatabaseService, DbConfigObjectConnection, repo } from "@services/db-access-manager";


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
    await this.dbService.start();
  }

  public getDatabaseService() {
    return this.dbService;
  }

  protected initializeDBService() {
    this.dbService = new DatabaseService();
    this.dbService.addConnection(new DbConfigObjectConnection("test_connection", {
      connectionName: "admin",
      filePath: {
        isAbsolute: false,
        value: DEFAULT_RELATIVE_CONNECTION_PATH
      }
    }))
    this.dbService.setDefaultConnection("test_connection");
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
    const nhanvienRepo = this.dbService.createRepository(repo.NhanVienRepository);
    const taikhoanRepo = this.dbService.createRepository(repo.TaiKhoanRepository);
    const nhacungcapRepo = this.dbService.createRepository(repo.NhaCungCapRepository);
    const sanphamRepo = this.dbService.createRepository(repo.SanPhamRepository);

    this.app.use(new NhanVienController(nhanvienRepo, taikhoanRepo, nhacungcapRepo, "/nhanvien").getRouter());
    this.app.use(new SanPhamController(sanphamRepo, nhacungcapRepo, "/sanpham").getRouter());
  }

  protected initializeErrorHandles() {
    this.app.use(HttpException);
  }
}
