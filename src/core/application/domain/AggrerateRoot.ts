import Entity from "./Entity";

export default abstract class AggrerateRoot<T> extends Entity<T> {

  constructor(props: T) {
    super(props);
  }
}

