import { IDomainService } from "@core";


export default class DomainService implements IDomainService {

  private static services: { [serviceName: string]: IDomainService } = {};

  protected initialize(): Promise<void> { return; }

  static getService<T extends IDomainService>(type: new (...args: any[]) => T, ...args: any[]) {
    let service = this.services[type.name] as T;
    if (!service) {
      this.services[type.name] = new type(...args);
    }
    return this.services[type.name] as T;
  }

  static createService<T extends IDomainService>(type: new (...args: any[]) => T, ...args: any[]) {
    this.services[type.name] = new type(...args);
    return this.services[type.name];
  }
}