import uniqid from "uniqid";
import { AggrerateRoot, SuccessResult, FailResult } from "@core";
import { PhieuBanHangProps, PhieuBanHangDTO } from "./PhieuBanHangProps";
import { classToPlain, plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { CTPhieuBanHang } from "@modules/ctphieubanhang";
import { KhachHang } from "@modules/khachhang";
import { NhanVien } from "@modules/nhanvien";
import PhieuBanHangCreated from "./PhieuBanHangCreated";


export default class PhieuBanHang extends AggrerateRoot<PhieuBanHangProps> {
  
  private _listCTPhieu: CTPhieuBanHang[];
  private _khachHang: KhachHang;
  private _nhanVien: NhanVien;

  private constructor(props: PhieuBanHangProps, khachhang: KhachHang, nhanvien: NhanVien, listCTPhieu: CTPhieuBanHang[]) {
    super(props);
    if (!props.id) {
      props.id = uniqid();
    }
    if (!props.tongGiaTri) {
      props.tongGiaTri = 0;
    }
    if (!props.ngayLap) {
      props.ngayLap = new Date()
    }
    this._nhanVien = nhanvien;
    this._khachHang = khachhang;
    this._listCTPhieu = listCTPhieu;
    this._listCTPhieu.forEach(ctphieu => ctphieu.setPhieuId(this.props.id));
    this.props.tongGiaTri = this.getTongGiaTri();
    // not allow to modify 
    Object.freeze(this._listCTPhieu);
    this.addDomainEvent(new PhieuBanHangCreated(this));
  }

  get phieuId() {
    return this.props.id;
  }

  get listChiTietPhieu() {
    return this._listCTPhieu;
  }
  
  get tongGiaTri() {
    return this.props.tongGiaTri;
  }

  get khachHang() {
    return this._khachHang;
  }

  get nhanVien() {
    return this._nhanVien;
  }

  private getTongGiaTri(): number {
    if (!this._listCTPhieu) {
      return 0;
    }
    return this._listCTPhieu.map(ctphieu => ctphieu.giaTri).reduce((pre, cur) => pre + cur);
  }
  
  serialize() {
    return classToPlain(this.props) as PhieuBanHangDTO;
  }
  
  public static async create(data: any, _listCTPhieu: CTPhieuBanHang[], khachhang: KhachHang, nhanvien: NhanVien, createType: string) {
    const phieu = plainToClass(PhieuBanHangProps, data, { groups: [createType] });
    const errors = await validate(phieu, { groups: [createType] });
    if (errors.length > 0) {
      return FailResult.fail(errors);
    }
    if (phieu.khachHangId !== khachhang.khachHangId) {
      return FailResult.fail(new ValidationError());
    }
    if (phieu.nhanvienId !== nhanvien.Id) {
      return FailResult.fail(new ValidationError());
    }
    return SuccessResult.ok(new PhieuBanHang(phieu, khachhang, nhanvien, _listCTPhieu));
  }
}