import fs from 'fs';
import { IAppSettings, ApplicationMode } from '@core';
import path from 'path';

const APP_SETTINGS_DEV_FILE = path.resolve(__dirname + "/../config/app-settings.development.json");
const APP_SETTINGS_PRODUCTION_fILE = path.resolve(__dirname, "/../config/app-settings.production.json");

export default class AppSettings implements IAppSettings {

  private appConfigFilePath: string;
  private configObj: any;

  private constructor(filePath: string) {
    this.appConfigFilePath = filePath;
    this.readConfigDataFromFile();
  }

  getDbConnectionData(): any {
    return this.configObj["dbConnection"];
  }

  getApplicationMode(): ApplicationMode {
    const appMode = this.configObj["mode"].toLowerCase();
    if (appMode === "development") {
      return ApplicationMode.Development;
    } 
    return ApplicationMode.Prduction;
  }

  getValue(key: string) {
    return this.configObj[key];
  }

  protected readConfigDataFromFile() {
    try { 
      this.configObj = JSON.parse(fs.readFileSync(this.appConfigFilePath, 'utf-8'));
    } catch (err) {
      throw new Error('[AppSettings] Error occurs when reading configuration file');
    }
  }

  static create(filePath: string) {
    return new AppSettings(filePath);
  }

  static createByMode(mode: string) {
    if (mode.toUpperCase() === 'DEVELOPMENT') {
      return new AppSettings(APP_SETTINGS_DEV_FILE);
    }
    return new AppSettings(APP_SETTINGS_PRODUCTION_fILE);
  }
}