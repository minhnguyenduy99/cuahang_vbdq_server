import uniqid from "uniqid";
import { KhachHangProps, KhachHangDTO } from "./KhachHangProps";
import { Entity, SuccessResult, FailResult } from "@core";
import { classToPlain, plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Phieu } from "@modules/phieu";

export default class KhachHang extends Entity<KhachHangProps> {
  
  private constructor(props: KhachHangProps) {
    super(props);
    if (!props.id) {
      props.id = uniqid();
    }
    if (!props.tongGiaTriBan && !props.tongGiaTriMua) {
      props.tongGiaTriMua = props.tongGiaTriBan = 0;
    }
  }

  get khachHangId() {
    return this.props.id;
  }

  updateTongGiaTriBan(phieu: Phieu) {
    if (!phieu) {
      return;
    }
    this.props.tongGiaTriMua += phieu.tongGiaTri;
  }
  
  serialize(type: string) {
    return classToPlain(this.props, { groups: [type] }) as KhachHangDTO;
  }

  public static async create(data: any, createType: string) {
    const khachHangProps = plainToClass(KhachHangProps, data, { groups: [createType], excludeExtraneousValues: true });
    const errors = await validate(khachHangProps, { groups: [createType] });

    if (errors.length === 0) {
      return SuccessResult.ok(new KhachHang(khachHangProps));
    }
    return FailResult.fail(errors);
  }
}