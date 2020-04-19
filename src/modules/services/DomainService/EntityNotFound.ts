import { DomainServiceError } from "@core";

export default class EntityNotFound extends DomainServiceError {

  constructor(type: Function) {
    super(type, `${type.name} not found`);
  }
}