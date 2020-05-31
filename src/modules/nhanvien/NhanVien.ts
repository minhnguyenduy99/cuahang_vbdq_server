import uniqid from "uniqid";
import { Entity, SuccessResult, FailResult, InvalidEntity, DomainEvents, AggrerateRoot } from "@core";
import { classToPlain, plainToClass } from "class-transformer";
import { validate } from "class-validator";
import NhanVienProps from "./NhanVienProps";
import { TaiKhoanDTO, TaiKhoan } from "@modules/taikhoan";
import NhanVienCreated from "./NhanVienCreated";

export interface NhanVienDTO {
  id: string;
  idql: string;
  luong: number;
  ho_ten: string;
  cmnd: string;
  ngay_sinh: Date;
  gioi_tinh: string;
  sdt: string;
  dia_chi: string;
  ghi_chu: string;
  tk_id: string;
}

export class NhanVien extends AggrerateRoot<NhanVienProps> {

  private _taiKhoan: TaiKhoan;

  private constructor(props: NhanVienProps, taikhoan?: TaiKhoan) {
    super(props);
    if (!this.props.id) {
      this.props.id = uniqid();
    }
    if (!taikhoan) {
      return;
    }
    if (!this.isTaiKhoanMatch(taikhoan)) {
      throw new InvalidEntity("NhanVien", "TaiKhoan", "taikhoan id does not match");
    }
    this._taiKhoan = taikhoan;
    this.props.taiKhoanId = this.taiKhoan.id;
    this.addDomainEvent(new NhanVienCreated(this));
  }

  private isTaiKhoanMatch(taikhoan: TaiKhoan) {
    return this.props.taiKhoanId === taikhoan.id;
  }

  get Id() {
    return this.props.id;
  }

  get quanlyId() {
    return this.props.idql;
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

  get taiKhoan() {
    return this._taiKhoan;
  }

  serialize(type: string) {
    return classToPlain(this.props, { groups: [type] }) as NhanVienDTO;
  }

  static async create(data: any, createType: string, taikhoan?: TaiKhoan) {
    const dataDTO = plainToClass(NhanVienProps, data, { groups: [createType], excludeExtraneousValues: true });
    const errors = await validate(dataDTO, { groups: [createType]});
    if (errors.length === 0) {
      return SuccessResult.ok(new NhanVien(dataDTO, taikhoan));
    }
    return FailResult.fail(errors);
  }
}