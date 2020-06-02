import { IDomainEvent, UniqueEntityID } from "@core";
import Phieu from "./Phieu";


export default class PhieuCreated<T extends Phieu> implements IDomainEvent {
  
  dateTimeOccurred: Date;

  constructor(
    public readonly phieu: T) {
  }

  getAggregateId(): UniqueEntityID {
    return this.phieu.entityId;
  }
}