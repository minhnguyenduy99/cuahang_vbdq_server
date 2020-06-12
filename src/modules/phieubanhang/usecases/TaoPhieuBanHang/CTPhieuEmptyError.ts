import { ValidationError } from "class-validator";
import { TaoCTPhieuDTO } from "./TaoCTPhieu";


export default class CTPhieuEmptyError extends ValidationError {

  constructor(value: TaoCTPhieuDTO[]) {
    super();
    this.constraints = {};
    this.constraints["CTPHIEU_ERROR"] = "Danh sách chi tiết phiếu rỗng";
    this.property = "ds_ctphieu";
    this.value = value;
  }
}