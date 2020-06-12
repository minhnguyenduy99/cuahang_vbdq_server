import { shallowEqual } from "shallow-equal-object";
import ISerializable from "./ISerializable";

export default abstract class ValueObject<T> implements ISerializable {
  protected props: T;

  protected constructor (props: T) {
    this.props = props;
  }

  public equals (vo?: ValueObject<T>) : boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (vo.props === undefined) {
      return false;
    }
    return shallowEqual(this.props, vo.props)
  }

  public abstract serialize(): any;

  abstract getValue(): any;
}
