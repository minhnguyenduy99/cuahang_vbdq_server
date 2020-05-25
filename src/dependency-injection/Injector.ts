import { Type } from "./GenericClassDecorator";


export const Injector = new class {
  resolve<T>(target: Type<any>): T {
    // tokens are required dependencies, while injections are resolved tokens from the Injector
    let tokens = Reflect.getMetadata('design:paramtypes', target) || [],
      injections = tokens.map((token: any) => Injector.resolve<any>(token));

    return new target(...injections);
  }
}