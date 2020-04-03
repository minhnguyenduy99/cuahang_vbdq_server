import { ValidationError } from "class-validator";


export default class NhaCungCapNotFound extends ValidationError {

  constructor(requestId: string) {
    super();
    this.value = requestId;
    this.constraints = {};
    this.constraints["INVALID_REQUEST_ID"] = "Không tìm thấy nhà cung cấp";
    this.property = "nhacc_id";
  }
}