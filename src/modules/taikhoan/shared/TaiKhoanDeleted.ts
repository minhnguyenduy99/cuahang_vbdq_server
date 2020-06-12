import { IDomainEvent, UniqueEntityID } from "@core";
import TaiKhoan from "../TaiKhoan";


export default class TaiKhoanDeleted implements IDomainEvent {
  
  dateTimeOccurred: Date;
  readonly taikhoan: TaiKhoan;

  constructor(taikhoan: TaiKhoan) {
    this.taikhoan = taikhoan;
  }
  
  getAggregateId(): UniqueEntityID {
    return this.taikhoan.entityId;
  }
}