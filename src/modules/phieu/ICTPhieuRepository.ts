import { Result, IRepositoryError } from "@core";
import { ChiTietPhieu, ChiTietPhieuDTO } from ".";



export default interface ICTPhieuRepository<CT extends ChiTietPhieu> {
 
  createListCTPhieu(listCTPhieu: CT[]): Promise<void>;

  findAllCTPhieu(phieuId: string): Promise<ChiTietPhieuDTO[]>;
}