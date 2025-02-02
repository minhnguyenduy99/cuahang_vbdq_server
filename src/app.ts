// import built-in modules
import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import formData from "express-form-data";
import session from "express-session";
import morgan from "morgan";
import "reflect-metadata";

import { IAppSettings, ApplicationMode, IApp } from "@core";
import { Dependency, DEPConsts } from '@dep';
import AppSettings from "./settings/app-settings";
import initializeModule from "./settings/initializeModule";

// import middlewares
import { HttpExceptionHandle, authenticationChecking } from "@middlewares";

// import custom controllers
import {
  NhanVienController,
  SanPhamController,
  PhieuBanHangController,
  LoginController,
  KhachHangController,
  PhieuNhapKhoController,
  NhaCungCapController,
  TaiKhoanController,
  FreeController
} from "@controllers";
import { ErrorFactory } from "./services";


export default class App implements IApp {

  protected settings: IAppSettings;
  protected dep: Dependency;
  protected app: express.Application;

  constructor(settingFile: string) {

    this.settings = AppSettings.createByMode(settingFile);
    this.dep = Dependency.create(this.settings);

    this.app = express();
  }

  async initialize() {
    await this.initializeApplicationService();
    
    this.initializeRepositories();

    await initializeModule(this.dep);

    this.initializeMiddlewares();
    this.initializeControllers();
    this.initializeErrorHandles();
  }

  async start() {
    const host = this.isProductionMode() ? "0.0.0.0" : this.settings.getValue("host");
    const port = this.isProductionMode() ? process.env.PORT : this.settings.getValue("port");
    this.app.listen(port, host, () => {
      console.log(`The application is listening at ${host}:${port}...`);
    })
  }

  protected async initializeApplicationService() {
    await Promise.all([
      this.dep.setDatabaseService(DEPConsts.DatabaseService),
      this.dep.registerApplicationService(DEPConsts.ImageLoader),
      this.dep.registerApplicationService(DEPConsts.AuthorizationService),
      this.dep.registerApplicationService(DEPConsts.Tokenizer)
    ]);

    // temporarily remove authorization
    this.dep.getApplicationSerivce(DEPConsts.AuthorizationService).useAuthorization(true);
  }

  protected initializeMiddlewares(): void {
    this.app.use(morgan("dev"));
    this.app.use(cors({
      origin: "*",
      allowedHeaders: "*"
    }));
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
    this.app.get("/visitor_token", async (req, res, next) => {
      let token = await Dependency.Instance.getDomainService(DEPConsts.RoleService).addVisitor();
      res.status(200).json({ token: token })
    });
    this.app.use(new FreeController("/free").getRouter());
    this.app.use(new NhanVienController("/nhanvien").getRouter());
    this.app.use(new SanPhamController("/sanpham").getRouter());
    this.app.use(new KhachHangController("/khachhang").getRouter());
    this.app.use(new PhieuBanHangController("/phieubanhang").getRouter());
    this.app.use(new PhieuNhapKhoController("/phieunhapkho").getRouter());
    this.app.use(new LoginController("/login").getRouter());
    this.app.use(new NhaCungCapController("/nhacungcap").getRouter());
    this.app.use(new TaiKhoanController("/taikhoan").getRouter());
    this.app.get("/logout", authenticationChecking(), async (req, res, next) => {
      let authenticate = req.body.authenticate
      if (!authenticate) {
        return next(ErrorFactory.unauthenticated());
      }
      let authorize = this.dep.getApplicationSerivce(DEPConsts.AuthorizationService);
      await authorize.removeUser(authenticate.tk_id);
      return res.status(200).json({ 
        message: "Logout"
      })
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
