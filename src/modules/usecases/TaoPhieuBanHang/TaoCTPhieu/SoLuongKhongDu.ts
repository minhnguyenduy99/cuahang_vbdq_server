import { ValidationError } from "class-validator";
import { CTPhieuBanHang } from "../../../ctphieubanhang";
import { UseCaseError } from "@core";
import { TaoCTPhieu } from "./TaoCTPhieu";


export default class SoLuongSanPhamKhongDu extends UseCaseError<TaoCTPhieu> {

  constructor() {
    super(TaoCTPhieu);
    this.usecase = TaoCTPhieu.name;
    this.message = "Số lượng sản phẩm không đủ";
  }
}