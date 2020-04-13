import { Result, IDatabaseError } from "@core";
import { ChiTietPhieu, ChiTietPhieuDTO } from ".";



export default interface ICTPhieuRepository<CT extends ChiTietPhieu> {
 
  createListCTPhieu(listCTPhieu: CT[]): Promise<Result<void, IDatabaseError>>;

  findAllCTPhieu(phieuId: string): Promise<Result<ChiTietPhieuDTO[], IDatabaseError>>;
}