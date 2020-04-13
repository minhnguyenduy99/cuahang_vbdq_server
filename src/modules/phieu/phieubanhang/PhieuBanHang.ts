import { SuccessResult, FailResult } from "@core";
import { classToPlain } from "class-transformer";
import { KhachHang } from "@modules/khachhang";
import { NhanVien } from "@modules/nhanvien";
import { ChiTietPhieu, Phieu } from "@modules/phieu";
import { PhieuBanHangProps, PhieuBanHangDTO } from "./PhieuBanHangProps";


export default class PhieuBanHang extends Phieu {
  
  private _khachHang: KhachHang;
  
  constructor(props: PhieuBanHangProps, khachhang: KhachHang, nhanvien: NhanVien, listCTPhieu: ChiTietPhieu[]) {
    super(props, nhanvien, listCTPhieu);
    this._khachHang = khachhang;
  }

  get khachHang() {
    return this._khachHang;
  }
  
  serialize(type: string) {
    return super.serialize(type) as PhieuBanHangDTO;
  }
  
  public static async create(data: any, _listCTPhieu: ChiTietPhieu[], khachhang: KhachHang, nhanvien: NhanVien, createType: string) {
    const createPhieuProps = await Phieu.createPhieuProps(PhieuBanHangProps, data, _listCTPhieu, nhanvien, createType);
    if (createPhieuProps.isFailure) {
      return FailResult.fail(createPhieuProps.error);
    }
    const props = createPhieuProps.getValue();
    if (!khachhang || props.khachHangId !== khachhang.khachHangId) {
      throw new Error("[Internal error] Invalid `khachhang`");
    }
    return SuccessResult.ok(new PhieuBanHang(props, khachhang, nhanvien, _listCTPhieu));
  }
}