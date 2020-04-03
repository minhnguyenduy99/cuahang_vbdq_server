import uniqid from "uniqid";
import { SanPhamProps, SanPhamDTO } from "./SanPhamProps";
import { Entity, SuccessResult, FailResult } from "@core";
import { classToPlain, plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { NhaCungCap } from "../nhacungcap";


export default class SanPham extends Entity<SanPhamProps> {

  private nhaCC: NhaCungCap;

  private constructor(props: SanPhamProps, nhaCungCap: NhaCungCap) {
    super(props);
    this.nhaCC = nhaCungCap;
    if (!props.id) {
      props.id = uniqid();
    }
    this.props.idNhaCC = this.nhaCC.id;
  }
  
  serialize() {
    return classToPlain(this.props) as SanPhamDTO;
  }

  get nhaCungCap() {
    return this.nhaCC;
  }

  static async create(data: any, nhaCungCap: NhaCungCap, createType?: string) {
    let dataDTO = plainToClass(SanPhamProps, data, { groups: [createType] });
    const errors = await validate(dataDTO, { groups: [createType] });
    if (errors.length === 0) {
      return SuccessResult.ok(new SanPham(dataDTO, nhaCungCap));
    }
    return FailResult.fail(errors);
  }
}