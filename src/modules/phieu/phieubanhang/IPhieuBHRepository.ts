import { IPhieuRepository } from "..";
import { PhieuBanHang } from ".";
import { PhieuBanHangDTO } from "./PhieuBanHangProps";
import { IRepositoryError, LimitResult, Result } from "@core";


export default interface IPhieuBHRepository extends IPhieuRepository<PhieuBanHang> {

  findAllPhieu(limit: LimitResult): Promise<Result<PhieuBanHangDTO[], IRepositoryError>>;
}