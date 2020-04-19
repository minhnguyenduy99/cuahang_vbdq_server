// import built-in modules
import fs from 'fs';
import path from 'path';
import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import formData from "express-form-data";
import session from "express-session";
import "reflect-metadata";

import { IDatabaseService, ApplicationService, IAppSettings, ApplicationMode, DomainService } from "@core"
import AppSettings from "./app-settings";

// import middlewares
import HttpException from "./middlewares/http-exception";

// import custom controllers
import NhanVienController from "./controllers/NhanVienController";
import SanPhamController from "./controllers/SanPhamController";
import PhieuBanHangController from "./controllers/PhieuBanHangController";
import LoginController from "./controllers/LoginController";
import KhachHangController from "./controllers/KhachHangController";

// import services
import { DatabaseService, repo } from "@services/db-access-manager";
import { ImageLoader } from "@services/image-loader";
import { IAuthenticate, DomainAuthentication } from '@services/authenticate';
import { DomainAuthenticateService } from '@modules/services/DomainService';

export default class App {

  private APP_SETTINGS_DEV_FILE = path.join(__dirname + "/config/app-settings.development.json");
  private APP_SETTINGS_PRODUCTION_fILE = path.join(__dirname, "/config/app-settings.production.json");
  private settings: IAppSettings;

  private app: express.Application;

  constructor(mode: string) {
    if (mode === "DEVELOPMENT") {
      this.settings = AppSettings.create(this.APP_SETTINGS_DEV_FILE);
    } else {
      this.settings = AppSettings.create(this.APP_SETTINGS_PRODUCTION_fILE);
    }
    this.app = express();
    this.initializeService();
    if (this.isDevelopmentMode()) {
      this.developmentMiddlewares();
    }
    this.initializeMiddlewares();
    this.initializeControllers();
    this.initializeErrorHandles();
  }

  async start() {
    await this.startService();

    const host = this.settings.getValue("host");
    const port = this.settings.getValue("port");
    this.app.listen(port, host, () => {
      console.log(`The application is listening at ${host}:${port}...`);
    })
  }

  protected async startService() {
    await ApplicationService.getService(DatabaseService).start();
  }

  protected initializeService() {
    ApplicationService.createService(ImageLoader, this.settings);
    ApplicationService.createService(DatabaseService, this.settings);
  }

  protected developmentMiddlewares() {
    // this.app.use(morgan("dev"));
  }

  protected initializeMiddlewares(): void {
    this.app.use(cors({
      origin: "*",
      allowedHeaders: "*"
    }));
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
    const dbService = ApplicationService.getService(DatabaseService);

    const nhanvienRepo = dbService.createRepository(repo.NhanVienRepository);
    const taikhoanRepo = dbService.createRepository(repo.TaiKhoanRepository);
    const nhacungcapRepo = dbService.createRepository(repo.NhaCungCapRepository);
    const sanphamRepo = dbService.createRepository(repo.SanPhamRepository);
    const khachhangRepo = dbService.createRepository(repo.KhachHangRepository);
    const phieuBHRepo = dbService.createRepository(repo.PhieuBHRepository);
    const ctphieuBHRepo = dbService.createRepository(repo.CTPhieuRepository, "CTPHIEUBANHANG");

    ApplicationService.createService(DomainAuthentication, this.settings, DomainService.getService(DomainAuthenticateService, taikhoanRepo));

    this.app.use(new NhanVienController(nhanvienRepo, taikhoanRepo, nhacungcapRepo, "/nhanvien").getRouter());
    this.app.use(new SanPhamController(sanphamRepo, nhacungcapRepo, "/sanpham").getRouter());
    this.app.use(new KhachHangController(khachhangRepo, "/khachhang").getRouter());
    this.app.use(new PhieuBanHangController("/phieubanhang", nhanvienRepo, khachhangRepo, phieuBHRepo, ctphieuBHRepo, sanphamRepo).getRouter());
    this.app.use(new LoginController("/login").getRouter());
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

  protected isDevelopmentMode() {
    return this.settings.getApplicationMode() === ApplicationMode.Development;
  }

  protected isProductionMode() {
    return this.settings.getApplicationMode() === ApplicationMode.Prduction;
  }
}
