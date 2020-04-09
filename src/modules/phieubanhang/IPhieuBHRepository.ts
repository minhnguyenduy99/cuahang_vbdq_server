import { IDatabaseRepository, IDatabaseError, Result } from "@core";
import { PhieuBanHang } from ".";



export default interface IPhieuBHRepository extends IDatabaseRepository<any> {

  createPhieu(phieu: PhieuBanHang): Promise<Result<void, IDatabaseError>>;

  removePhieu(phieuId: string): Promise<Result<void, IDatabaseError>>;
}