// import built-in modules
import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import formData from "express-form-data";
import session from "express-session";
import "reflect-metadata";

import { IAppSettings, ApplicationMode, IApp } from "@core";
import { Dependency, DEPConsts } from '@dep';
import AppSettings from "./settings/app-settings";

// import middlewares
import { HttpExceptionHandle } from "@middlewares";

// import custom controllers
import {
  NhanVienController,
  SanPhamController,
  PhieuBanHangController,
  LoginController,
  KhachHangController,
  PhieuNhapKhoController,
  NhaCungCapController
} from "@controllers";


export default class App implements IApp {

  protected settings: IAppSettings;
  protected dep: Dependency;
  protected app: express.Application;

  constructor(settingFile: string) {

    this.settings = AppSettings.createByMode(settingFile);
    this.dep = Dependency.create(this.settings);

    this.app = express();
    this.initializeDatabaseService();
    this.initializeRepositories();
    this.initializeApplicationService();

    if (this.isDevelopmentMode()) {
      this.developmentMiddlewares();
    }

    this.initializeMiddlewares();
    this.initializeControllers();
    this.initializeErrorHandles();
  }

  async start() {
    await this.startApplicationService();

    const host = this.settings.getValue("host");
    const port = this.settings.getValue("port");
    this.app.listen(port, host, () => {
      console.log(`The application is listening at ${host}:${port}...`);
    })
  }

  protected async startApplicationService() {
    await this.dep.getApplicationSerivce(DEPConsts.DatabaseService).start();
  }

  protected initializeApplicationService() {
    this.dep.registerApplicationService(DEPConsts.DomainAuthentication);
    this.dep.registerApplicationService(DEPConsts.ImageLoader);
  }

  protected initializeDatabaseService() {
    this.dep.setDatabaseService(DEPConsts.DatabaseService);
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

  protected initializeRepositories() {
    this.dep.registerRepository(DEPConsts.LoaiTaiKhoanRepository);
    this.dep.registerRepository(DEPConsts.TaiKhoanRepository);
    this.dep.registerRepository(DEPConsts.NhaCungCapRepository);
    this.dep.registerRepository(DEPConsts.KhachHangRepository);
    this.dep.registerRepository(DEPConsts.NhanVienRepository);
    this.dep.registerRepository(DEPConsts.SanPhamRepository);
    this.dep.registerRepository(DEPConsts.PhieuBHRepository);
    this.dep.registerRepository(DEPConsts.PhieuNhapKhoRepository);
    this.dep.registerRepository(DEPConsts.CTPhieuBHRepository);
    this.dep.registerRepository(DEPConsts.CTPhieuNKRepository);
  }

  protected initializeControllers(): void {
    this.app.use(new NhanVienController("/nhanvien").getRouter());
    this.app.use(new SanPhamController("/sanpham").getRouter());
    this.app.use(new KhachHangController("/khachhang").getRouter());
    this.app.use(new PhieuBanHangController("/phieubanhang").getRouter());
    this.app.use(new PhieuNhapKhoController("/phieunhapkho").getRouter());
    this.app.use(new LoginController("/login").getRouter());
    this.app.use(new NhaCungCapController("/nhacungcap").getRouter());
    this.app.get("/logout", (req, res, next) => {
      req.session.destroy((err) => {
        if (err) 
          console.log(err);
      });
      res.status(200).json({ code: 200, message: "Logout successfully" });
    })
  }

  protected initializeErrorHandles() {
    this.app.use(HttpExceptionHandle());
  }

  protected isDevelopmentMode() {
    return this.settings.getApplicationMode() === ApplicationMode.Development;
  }

  protected isProductionMode() {
    return this.settings.getApplicationMode() === ApplicationMode.Prduction;
  }
}
