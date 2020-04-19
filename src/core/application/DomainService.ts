import { IDomainService } from "@core";


export default class DomainService {

  static services: { [serviceName: string]: IDomainService } = {};

  static getService<T extends IDomainService>(type: new (...args: any[]) => T, ...args: any[]) {
    const service = this.services[type.name];
    if (!service) {
      this.services[type.name] = new type(...args);
    }
    return this.services[type.name] as T;
  }
}