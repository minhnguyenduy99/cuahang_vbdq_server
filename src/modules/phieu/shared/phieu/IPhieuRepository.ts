import { LimitResult } from "@core";
import Phieu from "./Phieu";
export default interface IPhieuRepository<P extends Phieu> {

  createPhieu(phieu: P): Promise<void>;

  removePhieu(phieuId: string): Promise<void>;

  findPhieuById(phieuId: string): Promise<any>;

  findPhieuByDate(date: Date, limit?: LimitResult): Promise<any[]>;

  findAllPhieu(limit: LimitResult): Promise<any[]>;
}