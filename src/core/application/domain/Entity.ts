import ISerializable from "./ISerializable";
import { ValueObjectProps } from "./ValueObject";

const isEntity = (obj: any): obj is Entity<any> => {
  return obj instanceof Entity;
}

export default abstract class Entity<T extends ValueObjectProps> implements ISerializable {
  protected props: T;

  constructor(props: T) {
    this.props = props;
  }


  public equals(obj: Entity<T>): boolean {
    if (!isEntity(obj)) {
      return false;
    }

    return this === obj;
  }

  abstract serialize(): any;
}

