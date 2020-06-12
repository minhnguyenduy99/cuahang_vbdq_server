import { Result, IDomainService, EntityNotFound } from "@core";
import { NhanVien } from "@modules/nhanvien";
import { ValidationError } from "class-validator";

export default interface INhanVienService extends IDomainService {

  getNhanVienById(nhanvienId: string): Promise<Result<NhanVien, ValidationError[] | EntityNotFound>>;

  persist(nhanvien: NhanVien): Promise<void>;

  updateNhanVien(nhanvien: NhanVien, updateInfo: any): Promise<Result<NhanVien, ValidationError[]>>;
}