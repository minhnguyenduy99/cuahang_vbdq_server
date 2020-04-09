import IApplicationService from "./IApplicationService";


export default class ApplicationService {
  static services: { [serviceName: string]: IApplicationService } = {};

  static getService<T extends IApplicationService>(type: new (...args: any[]) => T, ...args: any[]) {
    const service = this.services[type.name];
    if (!service) {
      this.services[type.name] = new type(...args);
    }
    return this.services[type.name] as T;
  }
}