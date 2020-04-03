import { UseCaseError } from "@core";
import { TaoNhaCungCap } from "./TaoNhaCungCap";


export default class NhaCungCapExistsError extends UseCaseError<TaoNhaCungCap> {

  constructor() {
    super(TaoNhaCungCap, "NhaCungCap exists")
  }
}