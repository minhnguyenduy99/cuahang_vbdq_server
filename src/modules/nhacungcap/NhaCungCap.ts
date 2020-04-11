import uniqid from "uniqid";
import { Entity, SuccessResult, FailResult } from "@core";
import NhaCungCapProps from "./NhaCungCapProps";
import { classToPlain, plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { IsImage } from "../helpers/custom-validator";


export interface NhaCungCapDTO {
  id: string;
  ten: string;
  dia_chi: string;
  anh_dai_dien: string;
  tong_gia_tri_nhap: number;
}

export class NhaCungCap extends Entity<NhaCungCapProps> {
  
  private constructor(props: NhaCungCapProps) {
    super(props);
    if (!this.props.id) {
      this.props.id = uniqid();
    }
    if (!this.props.tongGiaTriNhap) {
      this.props.tongGiaTriNhap = 0;
    }
  }

  get id() {
    return this.props.id;
  }

  get ten() {
    return this.props.ten;
  }

  get diaChi() {
    return this.props.diaChi;
  }

  get anhDaiDien() {
    return this.props.anhDaiDien;
  }

  get tongGiaTriNhap() {
    return this.props.tongGiaTriNhap;
  }  

  updateAnhDaiDien(source: string) {
    const isImageValid = (new IsImage().validate(source));
    if (!isImageValid) {
      return;
    }
    this.props.anhDaiDien = source;
  }

  serialize(type?: string) {
    return classToPlain(this.props, { groups: [type] }) as NhaCungCapDTO;
  }

  static async create(data: NhaCungCapDTO, createType: string) {
    const dataDTO = plainToClass(NhaCungCapProps, data, { groups: [createType], excludeExtraneousValues: true });
    const errors = await validate(dataDTO, { groups: [createType] });
    if (errors.length === 0) {
      return SuccessResult.ok(new NhaCungCap(dataDTO));
    }
    return FailResult.fail(errors);
  }
}