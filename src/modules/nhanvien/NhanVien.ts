import uniqid from "uniqid";
import { Entity, SuccessResult, FailResult } from "@core";
import { classToPlain, plainToClass } from "class-transformer";
import { validate } from "class-validator";
import NhanVienProps from "./NhanVienProps";
import { TaiKhoanDTO, TaiKhoan } from "@modules/taikhoan";

export interface NhanVienDTO {
  id: string;
  idql: string;
  chuc_vu: string;
  luong: number;
  ho_ten: string;
  cmnd: string;
  ngay_sinh: Date;
  gioi_tinh: string;
  sdt: string;
  dia_chi: string;
  ghi_chu: string;
  tai_khoan: TaiKhoanDTO;
}

export class NhanVien extends Entity<NhanVienProps> {

  private taiKhoan: TaiKhoan;

  private constructor(props: NhanVienProps, taikhoan: TaiKhoan) {
    super(props);
    if (!this.props.id) {
      this.props.id = uniqid();
    }
    this.taiKhoan = taikhoan;
    this.props.taiKhoanId = this.taiKhoan.id;
  }

  get id() {
    return this.props.id;
  }

  get quanlyId() {
    return this.props.idql;
  }

  get chucVu() {
    return this.props.chucvu;
  }

  get luong() {
    return this.props.luong;
  }

  get hoTen() {
    return this.props.hoTen;
  }

  get cmnd() {
    return this.props.cmnd;
  }

  get ngaySinh() {
    return this.props.ngaySinh;
  }

  get gioiTinh() {
    return this.props.gioiTinh;
  }

  get soDienThoai() {
    return this.props.sdt;
  }

  get diaChi() {
    return this.props.diachi;
  }

  get ghiChu() {
    return this.props.ghichu;
  }

  get taikhoanId() {
    return this.props.taiKhoanId;
  }

  serialize() {
    return classToPlain(this.props) as NhanVienDTO;
  }

  static async create(data: any, taiKhoan: TaiKhoan, createType?: string) {
    const dataDTO = plainToClass(NhanVienProps, data, { groups: [createType] });
    const errors = await validate(dataDTO, { groups: [createType]});
    if (errors.length === 0) {
      dataDTO.id = uniqid();
      return SuccessResult.ok(new NhanVien(dataDTO, taiKhoan));
    }
    return FailResult.fail(errors);
  }
}