import { Result, DomainServiceError, IRepositoryError, IDomainService, BaseAppError } from "@core";
import { NhanVien } from "@modules/nhanvien";
import { EntityNotFound } from "../DomainService";
import { ValidationError } from "class-validator";


export default interface INhanVienService extends IDomainService {

  getNhanVienById(nhanvienId: string): Promise<Result<NhanVien, ValidationError[] | EntityNotFound>>;
}