import { IDatabaseRepository, Result, IDatabaseError } from "@core";
import CTPhieuBanHang from "./CTPhieuBanHang";


export default interface ICTPhieuBHRepository extends IDatabaseRepository<any> {

  createListCTPhieu(listCTPhieu: CTPhieuBanHang[]): Promise<Result<void, IDatabaseError>>;
}