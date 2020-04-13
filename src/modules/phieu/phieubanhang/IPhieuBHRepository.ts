import { IPhieuRepository } from "..";
import { PhieuBanHang } from ".";
import { PhieuBanHangDTO } from "./PhieuBanHangProps";
import { IDatabaseError, LimitResult, Result } from "@core";


export default interface IPhieuBHRepository extends IPhieuRepository<PhieuBanHang> {

  findAllPhieu(limit: LimitResult): Promise<Result<PhieuBanHangDTO[], IDatabaseError>>;
}