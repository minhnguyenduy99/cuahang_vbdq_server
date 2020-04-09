import ISerializable from "./ISerializable";
import { ValueObjectProps } from "./ValueObject";
import { UniqueEntityID } from ".";

const isEntity = (obj: any): obj is Entity<any> => {
  return obj instanceof Entity;
}

export default abstract class Entity<T extends ValueObjectProps> implements ISerializable {
  protected props: T;
  protected _entityId: UniqueEntityID;
  protected _isStateChanged = true;

  constructor(props: T) {
    this.props = props;
    this._entityId = UniqueEntityID.create().getValue();
  }

  /**
   * ID of the entity
   */
  get entityId() {
    return this._entityId;
  }

  get isStateChanged() {
    return this._isStateChanged;
  }

  public equals(obj: Entity<T>): boolean {
    if (!isEntity(obj)) {
      return false;
    }

    return this === obj;
  }

  abstract serialize(type?: string): any;
}

