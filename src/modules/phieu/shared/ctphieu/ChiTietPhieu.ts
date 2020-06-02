import { Entity } from "@core";
import ChiTietPhieuProps from "./ChiTietPhieuProps";
import { IPurchasable } from "@modules/core";

export default abstract class ChiTietPhieu<T extends ChiTietPhieuProps> extends Entity<T> {
  
  protected hanghoa: IPurchasable;

  constructor(props: T, hanghoa?: IPurchasable) {
    super(props);
    if (!hanghoa) {
      return;
    }
    this.hanghoa = hanghoa;
    this.updateGiaTri();
  }

  setPhieuId(phieuId: string) {
    this.props.phieuId = phieuId;
    this._isStateChanged = true;
  }

  get phieuId() {
    return this.props.phieuId;
  }

  get soLuong() {
    return this.props.soLuong;
  }

  get hangHoa() {
    return this.hanghoa;
  }

  public getGiaTri() {
    return this.props.giaTri;
  }
  
  public abstract serialize(type: string): any;

  protected abstract updateGiaTri(): void;
}