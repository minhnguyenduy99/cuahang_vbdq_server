import { IDomainService } from "@core";
import { ChiTietPhieu } from "@modules/phieu";


export default interface ICTPhieuService<CT extends ChiTietPhieu<any>> extends IDomainService {
}