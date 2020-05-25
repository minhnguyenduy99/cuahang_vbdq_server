import { Type, GenericClassDecorator } from "./GenericClassDecorator";

export const Service = (): GenericClassDecorator<Type<object>> => {
  return target => {
    console.log(target)
  }
}