import { ValidationError } from "class-validator";
import { UseCaseError } from "@core";
import { TaoCTPhieu } from "./TaoCTPhieu";

export default class SanPhamKhongTonTai extends UseCaseError<TaoCTPhieu> {

  constructor(
    private sanphamId: string) {
    super(TaoCTPhieu);
    this.usecase = TaoCTPhieu.name;
    this.message = "Sản phẩm không tồn tại";
  }

  getErrorInfo() {
    return {
      ...super.getErrorInfo(),
      id: this.sanphamId
    }
  }
}