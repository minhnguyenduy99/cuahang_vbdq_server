import { Entity, SuccessResult, FailResult, InvalidEntity } from "@core";
import { classToPlain, plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { SanPham } from "../sanpham";
import { ChiTietPhieuProps, ChiTietPhieuDTO } from "./ChiTietPhieuProps";


export default class ChiTietPhieu extends Entity<ChiTietPhieuProps> {
  
  protected sanPham: SanPham;

  constructor(props: ChiTietPhieuProps, sanpham: SanPham) {
    super(props);
    if (!sanpham) {
      return;
    }
    this.setSanPham(sanpham);
  }

  private setSanPham(sanPham: SanPham) {
    if (!this.isSanPhamValid(sanPham)) {
      throw new InvalidEntity("SanPham", "CTPhieu", "[Internal] Sản phẩm không hợp lệ");
    }
    this.sanPham = sanPham;
    // Cập nhật giá trị của chi tiết phiếu
    this.updateGiaTri();
  }

  setPhieuId(phieuId: string) {
    this.props.phieuId = phieuId;
  }

  get phieuId() {
    return this.props.phieuId;
  }

  get sanphamId() {
    return this.props.sanphamId;
  }

  get soLuong() {
    return this.props.soLuong;
  }

  get chiTietSanPham() {
    return this.sanPham;
  }

  get giaTri() {
    return this.props.giaTri;
  }
  
  serialize(type: string) {
    return classToPlain(this.props, { groups: [type] }) as ChiTietPhieuDTO;
  }

  private updateGiaTri() {
    if (!this.sanPham) {
      return;
    }
    this.props.giaTri = this.props.soLuong * this.sanPham.giaBan;
  }

  protected isSanPhamValid(sanPham: SanPham) {
    if (!sanPham || sanPham.sanPhamId !== this.props.sanphamId || this.props.soLuong > sanPham.soLuong) {
      return false;
    }
    return true;
  }

  public static async create(data: any, createType: string, sanpham: SanPham) {
    const convertData = plainToClass(ChiTietPhieuProps, data, { groups: [createType] });
    const errors = await validate(convertData, { groups: [createType] });
    if (errors.length > 0) {
      return FailResult.fail(errors);
    }
    return SuccessResult.ok(new ChiTietPhieu(convertData, sanpham));
  }
}