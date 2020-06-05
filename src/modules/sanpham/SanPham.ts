import uniqid from "uniqid";
import { classToPlain, plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Entity, SuccessResult, FailResult, InvalidEntity } from "@core";
import { NhaCungCap } from "@modules/nhacungcap";
import { IPurchasable } from "@modules/core";
import SanPhamProps from "./SanPhamProps";
import SanPhamDTO from "./shared/SanPhamDTO";

export default class SanPham extends Entity<SanPhamProps> implements IPurchasable {

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

  updateSoLuong(soLuong: number) {
    if (soLuong < 0 || !Number.isInteger(soLuong)) {
      return false;
    }
    this.props.soLuong = soLuong;
    this._isStateChanged = true;
    return true;
  }

  updateAnhDaiDien(source: string) {
    this.props.anhDaiDien = source;
  }
  
  serialize() {
    return classToPlain(this.props) as SanPhamDTO;
  }

  getId() {
    return this.props.id;
  }

  getGiaTriBan() {
    return this.props.giaBan;
  }

  getGiaTriMua() {
    return this.props.giaNhap;
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

  get anhDaiDien() {
    return this.props.anhDaiDien;
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