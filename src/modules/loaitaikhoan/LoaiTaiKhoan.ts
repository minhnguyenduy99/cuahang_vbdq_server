import LoaiTaiKhoanProps from "./LoaiTaiKhoanProps";
import { Entity, SuccessResult, FailResult } from "@core";
import { LoaiTaiKhoanDTO } from ".";
import { plainToClass, classToPlain } from "class-transformer";
import { validate } from "class-validator";


export default class LoaiTaiKhoan extends Entity<LoaiTaiKhoanProps> {

  serialize(type?: string) {
    return classToPlain(this.props, { groups: [type] }) as LoaiTaiKhoanDTO;
  }

  get ma() {
    return this.props.maLTK;
  }

  get ten() {
    return this.props.tenLTK;
  }

  static async create(dto: LoaiTaiKhoanDTO, createType: string) {
    const dataDTO = plainToClass(LoaiTaiKhoanProps, dto, { groups: [createType], excludeExtraneousValues: true });
    const errors = await validate(dataDTO, { groups: [createType] });
    if (errors.length === 0) {
      return SuccessResult.ok(new LoaiTaiKhoan(dataDTO));
    }
    return FailResult.fail(errors);
  }
}