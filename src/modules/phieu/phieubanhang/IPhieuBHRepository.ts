import { IPhieuRepository } from "..";
import { PhieuBanHang } from ".";
import { PhieuBanHangDTO } from "./PhieuBanHangProps";
import { LimitResult } from "@core";


export default interface IPhieuBHRepository extends IPhieuRepository<PhieuBanHang> {

  findAllPhieu(limit: LimitResult): Promise<PhieuBanHangDTO[]>;
}