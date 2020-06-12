import { IDomainEvent, UniqueEntityID } from "@core";
import NhanVien from "./NhanVien";

export default class NhanVienCreated implements IDomainEvent {
  dateTimeOccurred: Date;

  constructor(
    public readonly nhanvien: NhanVien
  ) {

  }
  
  getAggregateId(): UniqueEntityID {
    throw new Error("Method not implemented.");
  }
}