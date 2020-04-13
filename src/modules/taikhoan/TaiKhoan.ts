import uniqid from "uniqid";
import bcrypt from "bcrypt";
import { Entity, SuccessResult, FailResult } from "@core";
import TaiKhoanProps from "./TaiKhoanProps";
import { plainToClass, classToPlain } from "class-transformer";
import { validate } from "class-validator";

export interface TaiKhoanDTO {
  id: string;
  ten_tk?: string;
  mat_khau?: string;
  anh_dai_dien?: string;
  loai_tk?: number;
}

export class TaiKhoan extends Entity<TaiKhoanProps> {

  private _isPasswordHash: boolean;

  private constructor(taikhoanProps: TaiKhoanProps) {
    super(taikhoanProps);
    if (!taikhoanProps.id) {
      taikhoanProps.id = uniqid()
      this._isPasswordHash = false;
      this._encryptPassword();
    } else {
      this._isPasswordHash = true;
    }
  }

  get id() {
    return this.props.id;
  }

  get tenTaiKhoan() {
    return this.props.tenTaiKhoan;
  }

  get matKhau() {
    return this.props.matKhau;
  }

  get anhDaiDien() {
    return this.props.anhDaiDien;
  }
  
  get loaiTaiKhoan() {
    return this.props.loaiTK;
  }

  async isMatKhauValid(matkhau: string) {
    const compare = await bcrypt.compare(matkhau, this.props.matKhau);
    return compare;
  }

  serialize(type: string) {
    return classToPlain(this.props, { groups: [type] }) as TaiKhoanDTO;
  }

  updateAnhDaiDien(imageUrl: string) {
    this.props.anhDaiDien = imageUrl;
  }

  private _encryptPassword() {
    const salt = bcrypt.genSaltSync();
    const encryptedMatKhau = bcrypt.hashSync(this.props.matKhau, salt);
    this.props.matKhau = encryptedMatKhau;
    this._isPasswordHash = true;
  }

  static async create(data: any, createType?: string) {
    const taiKhoanProps = plainToClass(TaiKhoanProps, data, { groups: [createType] });
    const errors = await validate(taiKhoanProps, { groups: [createType]});
    if (errors.length === 0) {
      return SuccessResult.ok(new TaiKhoan(taiKhoanProps));
    }
    return FailResult.fail(errors);
  }
}