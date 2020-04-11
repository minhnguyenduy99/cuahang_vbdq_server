import { UseCaseError } from "@core";
import { TaoKhachHang } from "./TaoKhachHang";



export default class KhachHangExists extends UseCaseError<TaoKhachHang> {

  private cmnd: string;

  constructor(cmnd: string) {
    super(TaoKhachHang, "Khách hàng đã tồn tại");
    this.cmnd = cmnd;
  }

  getErrorInfo() {
    return {
      ...super.getErrorInfo(),
      cmnd: this.cmnd
    }
  }
}