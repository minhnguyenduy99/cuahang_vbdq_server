import { IRepositoryError, Result, LimitResult } from "@core";
import { Phieu } from ".";
import { PhieuDTO } from "./PhieuProps";



export default interface IPhieuRepository<P extends Phieu> {

  createPhieu(phieu: P): Promise<Result<void, IRepositoryError>>;

  removePhieu(phieuId: string): Promise<Result<void, IRepositoryError>>;

  findPhieuById(phieuId: string): Promise<Result<any, IRepositoryError>>;

  findPhieuByDate(date: Date, limit?: LimitResult): Promise<Result<any[], IRepositoryError>>;

  findAllPhieu(limit: LimitResult): Promise<Result<any[], IRepositoryError>>;
}