import { Entity } from "@core";
import IMapper from "./IMapper.interface";


export default class MapperFactory {

  static createMapper<T extends IMapper<Entity<any>>>(type: new () => T) {
    return new type();
  }
}