import uniqid from "uniqid";
import { classToPlain, plainToClass } from "class-transformer";
import { validate } from "class-validator";

import { Entity, SuccessResult, FailResult, InvalidEntity } from "@core";
import { ChiTietPhieu } from "@modules/phieu";
import { NhaCungCap } from "@modules/nhacungcap";

import { SanPhamProps, SanPhamDTO } from "./SanPhamProps";

export default class SanPham extends Entity<SanPhamProps> {

  private nhaCC: NhaCungCap;

  private constructor(props: SanPhamProps, nhaCungCap?: NhaCungCap) {
    super(props);
    this.nhaCC = nhaCungCap;
    if (!props.id) {
      props.id = uniqid();
    }
    if (!nhaCungCap) {
      return;
    }
    this.props.idNhaCC = this.nhaCC.id;
  }

  setNhaCungCap(nhacungcap: NhaCungCap) {
    if (this.props.idNhaCC !== nhacungcap.id) {
      throw new InvalidEntity("SanPham", "NhaCungCap", "Invalid nhacungcap");
    }
    this.nhaCC = nhacungcap;
  }

  updateSoLuong(ctphieu: ChiTietPhieu) {
    if (this.sanPhamId !== ctphieu.sanphamId) {
      return;
    }
    this.props.soLuong -= ctphieu.soLuong;
  }

  updateAnhDaiDien(source: string) {
    this.props.anhDaiDien = source;
  }
  
  serialize() {
    return classToPlain(this.props) as SanPhamDTO;
  }

  get nhaCungCap() {
    return this.nhaCC;
  }

  get sanPhamId() {
    return this.props.id;
  }

  get soLuong() {
    return this.props.soLuong;
  }

  get giaBan() {
    return this.props.giaBan;
  }

  static async create(data: any, createType: string, nhaCungCap?: NhaCungCap) {
    let dataDTO = plainToClass(SanPhamProps, data, { groups: [createType], excludeExtraneousValues: true });
    const errors = await validate(dataDTO, { groups: [createType] });
    if (errors.length > 0) {
      return FailResult.fail(errors);
    }
    return SuccessResult.ok(new SanPham(dataDTO, nhaCungCap));
  }
}