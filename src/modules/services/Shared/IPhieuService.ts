import { Phieu, ChiTietPhieu } from "@modules/phieu";
import { IDomainService, IRepositoryError, Result, UseCaseError } from "@core";
import { ValidationError } from "class-validator";

export type PhieuCreateError = ValidationError | ValidationError[] | UseCaseError<any> | UseCaseError<any>[];
export interface IPhieuService<P extends Phieu> extends IDomainService {

  createPhieu<CT extends ChiTietPhieu>(phieuData: any, listCTphieu: CT[]): Promise<Result<P, PhieuCreateError>>;

  save(phieu: P): Promise<Result<void, IRepositoryError>>;
}