// import built-in modules
import path from "path";
import express from "express";
import bodyParser from "body-parser";
import formData from "express-form-data";
import session from "express-session";
import "reflect-metadata";
import cors from "cors";
import morgan from "morgan";

import { IDatabaseService } from "@core"

// import middlewares
import HttpException from "./middlewares/http-exception";

// import custom controllers
import NhanVienController from "./controllers/NhanVienController";
import SanPhamController from "./controllers/SanPhamController";
import PhieuBanHangController from "./controllers/PhieuBanHangController";
import LoginController from "./controllers/LoginController";

// import services
import { DatabaseService, DbConfigObjectConnection, repo } from "@services/db-access-manager";
import KhachHangController from "./controllers/KhachHangController";
import { ImageLoader } from "@services/image-loader";



const DEFAULT_RELATIVE_CONNECTION_PATH = "/config/db-connection.json";

export default class App {

  private app: express.Application;

  private dbService: IDatabaseService;
  private imageLoaderService: ImageLoader;

  constructor() {
    this.app = express();

    this.initializeService();

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
    await Promise.all([
      this.dbService.start(),
      this.imageLoaderService.start()
    ]);
  }

  protected initializeService() {
    this.imageLoaderService = new ImageLoader();
    this.initializeDBService();
  }

  protected initializeDBService() {
    this.dbService = new DatabaseService();
    this.dbService.addConnection(new DbConfigObjectConnection("test_connection", {
      connectionName: "remote",
      filePath: {
        isAbsolute: false,
        value: DEFAULT_RELATIVE_CONNECTION_PATH
      }
    }))
    this.dbService.setDefaultConnection("test_connection");
  }

  protected initializeMiddlewares(): void {
    this.app.use(cors({
      origin: "*",
      allowedHeaders: "*"
    }));
    this.app.use(morgan("dev"));
    // Body parser middlewares
    this.app.use(formData.parse({
      autoClean: true,
      autoFiles: true,
      uploadDir: "tmp"
    }))
    this.app.use(formData.union());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    // this.app.use(cookieParser());
    this.app.use(session({
      saveUninitialized: false,
      resave: false,
      secret: "relife_server_secret",
      name: "relife_server_id"
    }))
  }

  protected initializeControllers(): void {
    const nhanvienRepo = this.dbService.createRepository(repo.NhanVienRepository);
    const taikhoanRepo = this.dbService.createRepository(repo.TaiKhoanRepository);
    const nhacungcapRepo = this.dbService.createRepository(repo.NhaCungCapRepository);
    const sanphamRepo = this.dbService.createRepository(repo.SanPhamRepository);
    const khachhangRepo = this.dbService.createRepository(repo.KhachHangRepository);
    const phieuBHRepo = this.dbService.createRepository(repo.PhieuBHRepository);
    const ctphieuBHRepo = this.dbService.createRepository(repo.CTPhieuRepository, "CTPHIEUBANHANG");

    this.app.use(new NhanVienController(this.imageLoaderService, nhanvienRepo, taikhoanRepo, nhacungcapRepo, "/nhanvien").getRouter());
    this.app.use(new SanPhamController(sanphamRepo, nhacungcapRepo, this.imageLoaderService,  "/sanpham").getRouter());
    this.app.use(new KhachHangController(khachhangRepo, "/khachhang").getRouter());
    this.app.use(new PhieuBanHangController("/phieubanhang", nhanvienRepo, khachhangRepo, phieuBHRepo, ctphieuBHRepo, sanphamRepo).getRouter());
    this.app.use(new LoginController("/login", taikhoanRepo).getRouter());
    this.app.get("/logout", (req, res, next) => {
      req.session.destroy((err) => {
        if (err) 
          console.log(err);
      });
      res.status(200).json({ code: 200, message: "Logout successfully" });
    })
  }

  protected initializeErrorHandles() {
    this.app.use(HttpException);
  }
}
