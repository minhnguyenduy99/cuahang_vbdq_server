import { Result, IRepositoryError } from "@core";
import { ChiTietPhieu, ChiTietPhieuDTO } from ".";



export default interface ICTPhieuRepository<CT extends ChiTietPhieu> {
 
  createListCTPhieu(listCTPhieu: CT[]): Promise<Result<void, IRepositoryError>>;

  findAllCTPhieu(phieuId: string): Promise<Result<ChiTietPhieuDTO[], IRepositoryError>>;
}