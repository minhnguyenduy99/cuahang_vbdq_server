import { IDatabaseError, Result, LimitResult } from "@core";
import { Phieu } from ".";
import { PhieuDTO } from "./PhieuProps";



export default interface IPhieuRepository<P extends Phieu> {

  createPhieu(phieu: P): Promise<Result<void, IDatabaseError>>;

  removePhieu(phieuId: string): Promise<Result<void, IDatabaseError>>;

  findPhieuById(phieuId: string): Promise<Result<any, IDatabaseError>>;

  findPhieuByDate(date: Date, limit?: LimitResult): Promise<Result<any[], IDatabaseError>>;

  findAllPhieu(limit: LimitResult): Promise<Result<any[], IDatabaseError>>;
}