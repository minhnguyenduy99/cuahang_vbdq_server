import IApplicationService from "./IApplicationService";
import { IAppSettings } from ".";


export type ServiceCreateType<T extends IApplicationService> = new (settings: IAppSettings, ...args: any[]) => T;

export default abstract class ApplicationService<SettingsData> implements IApplicationService {
  static services: { [serviceName: string]: IApplicationService } = {};

  protected serviceData: SettingsData;

  constructor(appSettings: IAppSettings) {
    this.serviceData = this.getAppSettings(appSettings); 
  }
  protected abstract getAppSettings(settings: IAppSettings): SettingsData;

  static createService<T extends IApplicationService>(type: ServiceCreateType<T>, settings: IAppSettings, ...args: any[]) {
    this.services[type.name] = new type(settings, ...args);
    return this.services[type.name] as T;
  }

  static getService<T extends IApplicationService>(type: ServiceCreateType<T>) {
    return this.services[type.name] as T;
  }
}