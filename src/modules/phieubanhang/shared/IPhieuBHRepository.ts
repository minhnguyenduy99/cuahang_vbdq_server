import { IPhieuRepository } from "../../phieu";
import { PhieuBanHang } from "..";
import PhieuBanHangDTO from "./PhieuBanHangDTO";
import { LimitResult } from "@core";


export default interface IPhieuBHRepository extends IPhieuRepository<PhieuBanHang> {

  findAllPhieu(limit: LimitResult): Promise<PhieuBanHangDTO[]>;
}