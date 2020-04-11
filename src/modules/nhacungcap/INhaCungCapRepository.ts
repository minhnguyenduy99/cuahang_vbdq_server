import { IDatabaseRepository, IDatabaseError, Result, LimitResult } from "@core";
import { NhaCungCap, NhaCungCapDTO } from "./NhaCungCap";



export default interface INhaCungCapRepository extends IDatabaseRepository<any> {

  createNhaCungCap(nhacungcap: NhaCungCap): Promise<Result<void, IDatabaseError>>;

  nhaCungCapExists(tenNhaCungCap: string): Promise<Result<boolean, IDatabaseError>>;

  getNhaCungCapById(id: string): Promise<Result<NhaCungCapDTO, IDatabaseError>>;

  searchNhaCungCap(ten: string): Promise<Result<NhaCungCapDTO[], IDatabaseError>>;

  persist(nhacungcap: NhaCungCap): Promise<Result<void, IDatabaseError>>;
}