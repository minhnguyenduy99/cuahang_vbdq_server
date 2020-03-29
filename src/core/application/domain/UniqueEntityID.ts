
import uniqid from "uniqid";
import ValueObject from "./ValueObject";

export interface UniqueEntityIDProps {
  id: string;
}

export default class UniqueEntityID extends ValueObject<UniqueEntityIDProps> {

  private constructor(id?: string) {
    let props = { id: id ? id : uniqid() }
    super(props);
  }

  getValue(): string {
    return this.props.id;
  }

  public static create(id?: string): UniqueEntityID {
    return new UniqueEntityID(id);
  }
}


