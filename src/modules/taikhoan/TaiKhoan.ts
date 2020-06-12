import uniqid from "uniqid";
import bcrypt from "bcrypt";
import { Entity, SuccessResult, FailResult, InvalidEntity, AggrerateRoot } from "@core";
import TaiKhoanProps from "./TaiKhoanProps";
import { plainToClass, classToPlain } from "class-transformer";
import { validate } from "class-validator";
import { LoaiTaiKhoan } from "@modules/loaitaikhoan";
import { CreateType } from "../core";
import { excludeEmpty } from "@modules/helpers";
import TaiKhoanDeleted from "./shared/TaiKhoanDeleted";
import { TaiKhoanDTO } from "./shared";

export default class TaiKhoan extends AggrerateRoot<TaiKhoanProps> {

  private _isPasswordHash: boolean;
  private loaiTK: LoaiTaiKhoan;

  private constructor(taikhoanProps: TaiKhoanProps, loaiTK?: LoaiTaiKhoan) {
    super(taikhoanProps);
    if (loaiTK && taikhoanProps.loaiTK !== loaiTK.ma) {
      throw new InvalidEntity("TaiKhoan", "TaiKhoan", "Loại tài khoản không khớp");
    }
    this.loaiTK = loaiTK ?? null;
    if (!taikhoanProps.id) {
      taikhoanProps.id = uniqid()
      this._isPasswordHash = false;
      this._encryptPassword();
    } else {
      this._isPasswordHash = true;
    }
    this.addDomainEvent(new TaiKhoanDeleted(this));
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
    return this.props.loaiTK.toString();
  }

  async isMatKhauValid(matkhau: string) {
    const compare = await bcrypt.compare(matkhau, this.props.matKhau);
    return compare;
  }

  serialize(type?: string) {
    return classToPlain(this.props, { groups: [type || CreateType.getGroups().toAppRespone] }) as TaiKhoanDTO;
  }

  updateAnhDaiDien(imageUrl: string) {
    this.props.anhDaiDien = imageUrl;
  }

  updateMatKhau(newMatKhau: string) {
    if (!newMatKhau || newMatKhau.length > 20) {
      return false;
    }
    this.props.matKhau = newMatKhau;
    this._encryptPassword();
    return true;
  }

  updateTenTaiKhoan(newTenTK: string) {
    if (!newTenTK || newTenTK.length > 20) {
      return false;
    }
    this.props.tenTaiKhoan = newTenTK;
    return true;
  }

  async update(dto: TaiKhoanDTO) {
    delete dto.id;
    let updateProps = plainToClass(TaiKhoanProps, dto, { groups: [CreateType.getGroups().update], excludeExtraneousValues: true });
    updateProps = excludeEmpty(updateProps);
    const errors = await validate(updateProps, { groups: [CreateType.getGroups().update]});
    if (errors.length > 0) {
      return FailResult.fail(errors);
    }
    Object.assign(this.props, updateProps);
    if (updateProps.matKhau) {
      this._encryptPassword();
    }
    return SuccessResult.ok(this);
  }

  private _encryptPassword() {
    const salt = bcrypt.genSaltSync();
    const encryptedMatKhau = bcrypt.hashSync(this.props.matKhau, salt);
    this.props.matKhau = encryptedMatKhau;
    this._isPasswordHash = true;
  }

  static async create(data: any, createType?: string, loaiTK: LoaiTaiKhoan = null) {
    const taiKhoanProps = plainToClass(TaiKhoanProps, data, { groups: [createType] });
    const errors = await validate(taiKhoanProps, { groups: [createType]});
    if (errors.length === 0) {
      return SuccessResult.ok(new TaiKhoan(taiKhoanProps, loaiTK));
    }
    return FailResult.fail(errors);
  }
}