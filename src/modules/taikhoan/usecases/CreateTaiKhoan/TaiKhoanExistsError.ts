import { UseCaseError } from "@core";
import { CreateTaiKhoan } from "./CreateTaiKhoan";


export default class TaiKhoanExistsError extends UseCaseError<CreateTaiKhoan>{

  constructor() {
    super(CreateTaiKhoan, "taikhoan exists");
  }
}