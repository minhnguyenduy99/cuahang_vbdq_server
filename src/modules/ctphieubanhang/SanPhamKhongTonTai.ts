import { ValidationError } from "class-validator";



export default class SanPhamKhongTonTai extends ValidationError {

  constructor(sanphamId: string) {
    super();
    this.property = "sp_id";
    this.value = sanphamId;
    this.constraints = {}
    this.constraints["SANPHAM_NOT_FOUND"] = `Không tìm thấy sản phẩm có id ${sanphamId}`;
  }
}