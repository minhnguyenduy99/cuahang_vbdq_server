import { classToPlain, plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { ChiTietPhieu } from "@modules/phieu";
import { SanPham } from "@modules/sanpham";
import { FailResult, SuccessResult } from "@core";
import { ChiTietPhieuBHProps } from "./ChiTietPhieuBHProps";
import { ChiTietPhieuBHDTO } from "./shared";

export default class ChiTietPhieuBH extends ChiTietPhieu<ChiTietPhieuBHProps> {

  public serialize(type?: string) {
    return classToPlain(this.props, { groups: [type] }) as ChiTietPhieuBHDTO;
  }
  
  protected updateGiaTri(): void {
    this.props.giaTri = this.soLuong * this.hangHoa.getGiaTriBan();
  }

  public static async create(data: any, createType: string, sanpham: SanPham) {
    let props = plainToClass(ChiTietPhieuBHProps, data, { groups: [createType], excludeExtraneousValues: true });
    let errors = await validate(props, { groups: [createType] });
    if (errors.length > 0) {
      return FailResult.fail(errors);
    }
    return SuccessResult.ok(new ChiTietPhieuBH(props, sanpham));
  }
}