import { shallowEqual } from "shallow-equal-object";


export interface ValueObjectProps {
  [index: string]: any;
}

export default abstract class ValueObject<T extends ValueObjectProps> {
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

  abstract getValue(): any;
}
