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

  private constructor(taikhoanProps: TaiKhoanProps) {
    super(taikhoanProps);
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


  serialize() {
    return classToPlain(this.props) as TaiKhoanDTO;
  }

  static async create(data: any, createType?: string) {
    const taiKhoanProps = plainToClass(TaiKhoanProps, data);
    const errors = await validate(taiKhoanProps, { groups: [createType]});
    if (errors.length === 0) {
      return SuccessResult.ok(new TaiKhoan(taiKhoanProps));
    }
    return FailResult.fail(errors);
  }
}