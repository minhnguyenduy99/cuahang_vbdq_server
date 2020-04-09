import { IDomainEvent, UniqueEntityID } from "@core";
import { PhieuBanHang } from ".";


export default class PhieuBanHangCreated implements IDomainEvent {
  
  dateTimeOccurred: Date;

  constructor(
    public readonly phieu: PhieuBanHang) {
  }

  getAggregateId(): UniqueEntityID {
    throw new Error("Method not implemented.");
  }

}