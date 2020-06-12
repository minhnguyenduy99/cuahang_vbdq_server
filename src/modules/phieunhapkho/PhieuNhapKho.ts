import { SuccessResult, FailResult } from "@core";
import { NhanVien } from "@modules/nhanvien";
import { ChiTietPhieu, Phieu } from "@modules/phieu";
import { PhieuNhapKhoProps, PhieuNhapKhoDTO } from "./PhieuNhapKhoProps";
import { NhaCungCap } from "@modules/nhacungcap";
import { ChiTietPhieuNhapKho, PhieuNhapKhoCreated } from ".";


export default class PhieuNhapKho extends Phieu {
  
  private _nhacungcap: NhaCungCap;
  
  constructor(props: PhieuNhapKhoProps, nhacungcap: NhaCungCap, nhanvien: NhanVien, listCTPhieu: ChiTietPhieuNhapKho[]) {
    super(props, nhanvien, listCTPhieu);
    this._nhacungcap = nhacungcap;
    this.domainEvents.push(new PhieuNhapKhoCreated(this));
  }

  get nhacungcap() {
    return this._nhacungcap;
  }
  
  serialize(type: string) {
    return super.serialize(type) as PhieuNhapKhoDTO;
  }
  
  public static async create(data: any, _listCTPhieu: ChiTietPhieuNhapKho[], nhacc: NhaCungCap, nhanvien: NhanVien, createType: string) {
    const createPhieuProps = await Phieu.createPhieuProps(PhieuNhapKhoProps, data, _listCTPhieu, nhanvien, createType);
    if (createPhieuProps.isFailure) {
      return FailResult.fail(createPhieuProps.error);
    }
    const props = createPhieuProps.getValue();
    if (!nhacc || props.nhaccId !== nhacc.id) {
      throw new Error("[Internal error] Invalid `nhacc`");
    }
    return SuccessResult.ok(new PhieuNhapKho(props, nhacc, nhanvien, _listCTPhieu));
  }
}