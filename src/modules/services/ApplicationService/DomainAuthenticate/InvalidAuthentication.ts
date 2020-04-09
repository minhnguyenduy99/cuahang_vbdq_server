import { ValidationError } from "class-validator";
import { UseCaseError } from "@core";



export default class InvalidAuthentication extends Error {
  
  constructor() {
    super();
    this.message = "Tên đăng nhập hoặc mật khẩu không chính xác";
  }
}