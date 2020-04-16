import uniqid from "uniqid";
import { AggrerateRoot, SuccessResult, FailResult } from "@core";
import { classToPlain, plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { NhanVien } from "@modules/nhanvien";
import { PhieuProps, PhieuDTO } from "./PhieuProps";
import ChiTietPhieu from "./ChiTietPhieu";
import PhieuCreated from "./PhieuCreated";
import { ClassType } from "class-transformer/ClassTransformer";


export type PhieuType<P extends Phieu> = ClassType<P>;

export default abstract class Phieu extends AggrerateRoot<PhieuProps> {
  
  protected _listCTPhieu: ChiTietPhieu[];
  protected _nhanVien: NhanVien;

  protected constructor(props: PhieuProps, nhanvien: NhanVien, listCTPhieu: ChiTietPhieu[]) {
    super(props);
    if (!props.id) {
      props.id = uniqid();
    }
    if (!props.tongGiaTri) {
      props.tongGiaTri = 0;
    }
    if (!props.ngayLap) {
      props.ngayLap = new Date()
    }
    this._nhanVien = nhanvien;
    this._listCTPhieu = listCTPhieu;
    this._listCTPhieu.forEach(ctphieu => ctphieu.setPhieuId(this.props.id));
    this.props.tongGiaTri = this.getTongGiaTri();
    // not allow to modify 
    Object.freeze(this._listCTPhieu);
    this.addDomainEvent(new PhieuCreated(this));
  }

  get phieuId() {
    return this.props.id;
  }

  get listChiTietPhieu() {
    return this._listCTPhieu;
  }
  
  get tongGiaTri() {
    return this.props.tongGiaTri;
  }

  get nhanVien() {
    return this._nhanVien;
  }

  protected getTongGiaTri(): number {
    if (!this._listCTPhieu) {
      return 0;
    }
    return this._listCTPhieu.map(ctphieu => ctphieu.giaTri).reduce((pre, cur) => pre + cur);
  }
  
  serialize(type: string) {
    return classToPlain(this.props, { groups: [type] });
  }
  
  protected static async createPhieuProps<Prop extends PhieuProps>(type: new () => Prop, data: any, _listCTPhieu: ChiTietPhieu[], nhanvien: NhanVien, createType: string) {
    const phieu = plainToClass(type, data, { groups: [createType], excludeExtraneousValues: true });
    const errors = await validate(phieu, { groups: [createType] });
    if (errors.length > 0) { 
      return FailResult.fail(errors);
    }
    if (phieu.nhanvienId !== nhanvien.Id) {
      return FailResult.fail(new ValidationError());
    }
    return SuccessResult.ok(phieu);
  }

  public static genericCreate<P extends Phieu>(type: PhieuType<P>, data: any, createType: string, listCTPhieu: any[]) {
    return new type(data, listCTPhieu, createType);
  }
}
