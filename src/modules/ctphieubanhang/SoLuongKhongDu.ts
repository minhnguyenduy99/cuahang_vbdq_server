import { ValidationError } from "class-validator";
import { CTPhieuBanHang } from ".";


export default class SoLuongSanPhamKhongDu extends ValidationError {

  constructor(sanphamId: string, soLuong: number) {
    super();
    this.property = "so_luong";
    this.value = soLuong;
    this.constraints = {} 
    this.target = sanphamId;
    this.constraints["INVALID_QUANTITY"] = "Số lượng sản phẩm không đủ";
  }
}