import { IDomainService } from "@core";
import { ICTPhieuService } from ".";
import { ChiTietPhieu } from "@modules/phieu";


export default interface ICTPhieuBHService extends ICTPhieuService<ChiTietPhieu> {
}