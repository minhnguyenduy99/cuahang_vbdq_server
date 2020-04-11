

import { UseCaseError } from "@core";
import { TaoTaiKhoan } from "./TaoTaiKhoan";


export default class NhanVienExists extends UseCaseError<TaoTaiKhoan> {

  private cmnd: string;

  constructor(cmnd: string) {
    super(TaoTaiKhoan, "Nhân viên đã tồn tại");
    this.cmnd = cmnd;
  }

  getErrorInfo() {
    return {
      ...super.getErrorInfo(),
      cmnd: this.cmnd
    }
  }
}