import { ChiTietPhieu } from "../phieu";
import { ChiTietPhieuNhapKhoProps, ChiTietPhieuNhapKhoDTO } from "./ChiTietPhieuNhapKhoProps";
import { SanPham } from "@modules/sanpham";
import { classToPlain, plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { FailResult, SuccessResult } from "@core";


export default class ChiTietPhieuNhapKho extends ChiTietPhieu<ChiTietPhieuNhapKhoProps> {
  
  public getGiaTri(): number {
    return this.hangHoa.getGiaTriMua() * this.soLuong;
  }

  public serialize(type?: string) {
    return classToPlain(this.props, { groups: [type] }) as ChiTietPhieuNhapKhoDTO;
  }
  
  protected updateGiaTri(): void {
    this.props.giaTri = this.hangHoa.getGiaTriMua() * this.soLuong;
  }

  public static async create(data: any, createType: string, sanpham: SanPham) {
    let props = plainToClass(ChiTietPhieuNhapKhoProps, data, { groups: [createType], excludeExtraneousValues: true });
    let errors = await validate(props, { groups: [createType] });
    if (errors.length > 0) {
      return FailResult.fail(errors);
    }
    return SuccessResult.ok(new ChiTietPhieuNhapKho(props, sanpham));
  }
}