
import uniqid from "uniqid";
import ValueObject from "./ValueObject";
import { SuccessResult } from "../Result";

export interface UniqueEntityIDProp {
  id: string;
}

export default class UniqueEntityID extends ValueObject<UniqueEntityIDProp> {

  private constructor(id?: string) {
    let props = { id: id ? id : uniqid() }
    super(props);
  }

  getValue(): string {
    return this.props.id;
  }

  public static create(id?: string) {
    return SuccessResult.ok(new UniqueEntityID(id));
  }

  public serialize() {
    return this.props.id;
  }
}


