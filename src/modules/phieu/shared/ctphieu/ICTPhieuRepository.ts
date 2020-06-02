import { ChiTietPhieu, ChiTietPhieuDTO } from "../..";

export default interface ICTPhieuRepository<CT extends ChiTietPhieu<any>> {
 
  createListCTPhieu(listCTPhieu: CT[]): Promise<void>;

  findAllCTPhieu<T extends ChiTietPhieuDTO>(phieuId: string): Promise<T[]>;
}