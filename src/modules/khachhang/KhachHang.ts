import uniqid from "uniqid";
import { Entity, SuccessResult, FailResult } from "@core";
import { classToPlain, plainToClass } from "class-transformer";
import { validate } from "class-validator";
import KhachHangProps from "./KhachHangProps";
import { Phieu } from "@modules/phieu";
import { KhachHangDTO } from ".";
import { CreateType } from "@modules/core";
import { excludeEmpty } from "@modules/helpers";

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

  async update(dto: any) {
    delete dto.id;
    let updateProps = plainToClass(KhachHangProps, dto, { groups: [CreateType.getGroups().update], excludeExtraneousValues: true });
    updateProps = excludeEmpty(updateProps);
    const errors = await validate(updateProps, { groups: [CreateType.getGroups().createNew]});
    if (errors.length > 0) {
      return FailResult.fail(errors);
    }
    Object.assign(this.props, updateProps);
    return SuccessResult.ok(this);
  }
  
  serialize(type?: string) {
    return classToPlain(this.props, { groups: [type || CreateType.getGroups().toAppRespone] }) as KhachHangDTO;
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