import { IDatabaseRepository, IDatabaseError, Result } from "@core";
import { NhaCungCap, NhaCungCapDTO } from "./NhaCungCap";



export default interface INhaCungCapRepository extends IDatabaseRepository {

  createNhaCungCap(nhacungcap: NhaCungCap): Promise<Result<void, IDatabaseError>>;

  nhaCungCapExists(tenNhaCungCap: string): Promise<Result<boolean, IDatabaseError>>;

  getNhaCungCapById(id: string): Promise<Result<NhaCungCapDTO, IDatabaseError>>;
}