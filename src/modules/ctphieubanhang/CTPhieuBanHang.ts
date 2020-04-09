import { Entity, SuccessResult, FailResult } from "@core";
import { CTPhieuBanHangDTO, CTPhieuBanHangProps } from "./CTPhieuBanHangProps";
import { classToPlain, plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { SanPham } from "../sanpham";
import SoLuongSanPhamKhongDu from "./SoLuongKhongDu";
import SanPhamKhongTonTai from "./SanPhamKhongTonTai";


export default class CTPhieuBanHang extends Entity<CTPhieuBanHangProps> {
  
  private sanPham: SanPham;

  private constructor(props: CTPhieuBanHangProps, sanpham?: SanPham) {
    super(props);
    if (!sanpham) {
      return;
    }
    this.setSanPham(sanpham);
  }

  setSanPham(sanPham: SanPham) {
    if (!sanPham || sanPham.sanPhamId !== this.props.sanphamId) {
      throw new SanPhamKhongTonTai(sanPham.sanPhamId);
    }
    if (this.props.soLuong > sanPham.soLuong) {
      throw new SoLuongSanPhamKhongDu(sanPham.sanPhamId, this.soLuong);
    }
    this.sanPham = sanPham;
    // Cập nhật giá trị của chi tiết phiếu
    this.updateGiaTri();
  }

  setPhieuId(phieuId: string) {
    this.props.phieuMuaHangId = phieuId;
  }

  get phieuId() {
    return this.props.phieuMuaHangId;
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
    return classToPlain(this.props, { groups: [type] }) as CTPhieuBanHangDTO;
  }

  private updateGiaTri() {
    if (!this.sanPham) {
      return;
    }
    this.props.giaTri = this.props.soLuong * this.sanPham.giaBan;
  }

  private isSanPhamValid(sanPham: SanPham) {
    if (!sanPham || sanPham.sanPhamId !== this.props.sanphamId || this.props.soLuong > sanPham.soLuong) {
      return false;
    }
    return true;
  }

  public static async create(data: any, createType: string, sanpham?: SanPham) {
    const convertData = plainToClass(CTPhieuBanHangProps, data, { groups: [createType] });
    const errors = await validate(convertData, { groups: [createType] });
    if (errors.length > 0) {
      return FailResult.fail(errors);
    }
    try {
      return SuccessResult.ok(new CTPhieuBanHang(convertData, sanpham));
    } catch (err) {
      return FailResult.fail(err);
    }
  }
}